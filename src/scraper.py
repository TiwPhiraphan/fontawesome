import asyncio, json, re, sys
from pathlib import Path
from typing import Literal, overload
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout, BrowserContext

FONTAWESOME        = "https://fontawesome.com/search?ic=free-collection"
ICON_LIST_SEL      = "div.compact.icon-listing.margin-top-lg.margin-bottom-4xl"
PAGINATION         = "div.padding-horizontal-3xs button.flat.clear"
FREE_BUTTON_ACTIVE = "button[aria-label='Free Icons'].active"
PAGINATION_JS      = """
    () => {
        const btns = [...document.querySelectorAll('div.padding-horizontal-3xs button.flat.clear')]
        const nums = btns.map(b => parseInt(b.innerText.trim(), 10)).filter(n => !isNaN(n))
        return nums.length ? Math.max(...nums) : 0
    }
"""
REWRITE_TARGET = "{fas:{},far:{},fab:{}}"
TIMEOUT_MS     = 20_000
HEADLESS       = True
OUT_FILE       = Path(__file__).parent.resolve() / "free.ts"
MODEL_BYTES    = b"import { createElement } from 'react'\nimport type { CSSProperties } from 'react'\n\nconst metadata = {fas:{},far:{},fab:{}} as const\n\nexport const byPrefixAndName = {\n\tfas: metadata.fas,\n\tfar: metadata.far,\n\tfab: metadata.fab,\n}\n\ntype SizeOption =\n\t| 'xs' | 'sm' | 'lg'\n\t| '1x' | '2x' | '3x' | '4x' | '5x'\n\t| '6x' | '7x' | '8x' | '9x' | '10x'\n\ntype PullOption = 'left' | 'right'\ntype AnimationOption = 'spin' | 'pulse'\ntype RotateOption = '90' | '180' | '270'\ntype FlipOption = 'horizontal' | 'vertical' | 'both'\n\ntype IconProps = {\n\ticon: string\n\tsize?: SizeOption\n\tfixedWidth?: boolean\n\tanimation?: AnimationOption\n\trotate?: RotateOption\n\tflip?: FlipOption\n\tpull?: PullOption\n\tborder?: boolean\n\tinverse?: boolean\n\tstack?: '1x' | '2x'\n\tclassName?: string\n\tstyle?: CSSProperties\n\ttitle?: string\n\t'aria-hidden'?: boolean\n\t'aria-label'?: string\n}\n\nexport function FontAwesomeIcon({\n\ticon,\n\tsize,\n\tfixedWidth,\n\tanimation,\n\trotate,\n\tflip,\n\tpull,\n\tborder,\n\tinverse,\n\tstack,\n\tclassName,\n\t...rest\n}: IconProps) {\n\tif (!icon) return null\n\tconst classes = [\n\t\ticon,\n\t\tsize && `fa-${size}`,\n\t\tfixedWidth && 'fa-fw',\n\t\tanimation && `fa-${animation}`,\n\t\trotate && `fa-rotate-${rotate}`,\n\t\tflip && `fa-flip-${flip}`,\n\t\tpull && `fa-pull-${pull}`,\n\t\tborder && 'fa-border',\n\t\tinverse && 'fa-inverse',\n\t\tstack && `fa-stack-${stack}`,\n\t\tclassName,\n\t].filter(Boolean).join(' ')\n\treturn createElement('i', {\n\t\tclassName: classes,\n\t\t...rest,\n\t})\n}\n"

GROUPS  = {"fa-solid", "fa-regular", "fa-brands"}
MAPPING = {"fa-solid": "fas", "fa-regular": "far", "fa-brands": "fab"}

# ── ANSI colors ────────────────────────────────────────────────────────────────
RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
CYAN   = "\033[36m"
GREEN  = "\033[32m"
YELLOW = "\033[33m"
RED    = "\033[31m"
BLUE   = "\033[34m"

def _log(symbol: str, color: str, msg: str):
    print(f"  {color}{BOLD}{symbol}{RESET}  {msg}", flush=True)

def log_info(msg: str):  _log("◆", CYAN,   msg)
def log_ok(msg: str):    _log("✔", GREEN,  msg)
def log_warn(msg: str):  _log("⚠", YELLOW, msg)
def log_error(msg: str): _log("✘", RED,    msg)
def log_step(msg: str):  _log("›", BLUE,   msg)

def log_progress(current: int, total: int, found: int):
    bar_w  = 28
    filled = round(bar_w * current / total) if total else 0
    bar    = f"{GREEN}{'█' * filled}{DIM}{'░' * (bar_w - filled)}{RESET}"
    pct    = f"{current / total * 100:5.1f}%" if total else "  0.0%"
    print(
        f"\r  {BLUE}{BOLD}›{RESET}  [{bar}] {BOLD}{pct}{RESET}"
        f"  page {CYAN}{current}{RESET}/{CYAN}{total}{RESET}"
        f"  icons {GREEN}{found}{RESET}",
        end="", flush=True
    )

def log_progress_done():
    print()

def log_divider():
    print(f"  {DIM}{'─' * 52}{RESET}")

def log_summary(Icons: dict):
    fas   = len(Icons.get("fas", {}))
    far   = len(Icons.get("far", {}))
    fab   = len(Icons.get("fab", {}))
    total = fas + far + fab
    log_divider()
    print(f"  {BOLD}  fas{RESET}  {GREEN}{fas:>4}{RESET} icons")
    print(f"  {BOLD}  far{RESET}  {GREEN}{far:>4}{RESET} icons")
    print(f"  {BOLD}  fab{RESET}  {GREEN}{fab:>4}{RESET} icons")
    log_divider()
    print(f"  {BOLD}total{RESET}  {GREEN}{BOLD}{total:>4}{RESET} icons")

# ── Browser ────────────────────────────────────────────────────────────────────

async def init_browser(headless: bool = True):
    p = await async_playwright().start()
    browser = await p.chromium.launch(
        headless=headless,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
        ]
    )
    context = await browser.new_context(
        viewport={"width": 1440, "height": 900},
        extra_http_headers={"Referer": "https://fontawesome.com/"},
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    )
    return p, browser, context

# ── Scraping ───────────────────────────────────────────────────────────────────

@overload
async def get_content(target: str, context: BrowserContext, count: Literal[True]) -> tuple[int, list[dict]]: ...
@overload
async def get_content(target: str, context: BrowserContext, count: Literal[False] = False) -> list[dict]: ...
async def get_content(target: str, context: BrowserContext, count: bool = False):
    page = await context.new_page()
    page_count: int = 0
    try:
        await page.goto(target, wait_until="domcontentloaded", timeout=TIMEOUT_MS)
        await page.wait_for_selector(FREE_BUTTON_ACTIVE, timeout=TIMEOUT_MS)
        await asyncio.sleep(1)
        if count:
            await page.wait_for_selector(PAGINATION, timeout=TIMEOUT_MS)
        await page.wait_for_selector(ICON_LIST_SEL, timeout=TIMEOUT_MS)
        if count:
            page_count = await page.evaluate(PAGINATION_JS)
        class_names: list[str] = await page.eval_on_selector_all(
            f"{ICON_LIST_SEL} i",
            "els => els.map(el => el.className.trim())"
        )
        icons: list[dict] = []
        for class_str in class_names:
            parts = class_str.split()
            if len(parts) == 3:
                group = parts[1]
                name  = re.sub(r'^fa-', '', parts[2])
            elif len(parts) == 2:
                group = parts[0]
                name  = re.sub(r'^fa-', '', parts[1])
            else:
                continue
            if group in GROUPS and name:
                icons.append({ "group": group, "name": name, "value": class_str })
        if count:
            return page_count, icons
        return icons
    except PlaywrightTimeout:
        log_warn(f"Timeout — {target}")
        if count:
            return 0, []
        return []
    finally:
        await page.close()

# ── Format & write ─────────────────────────────────────────────────────────────

def icons_format(icons: list[dict]):
    Icons = {short: {} for short in MAPPING.values()}  # {fas:{}, far:{}, fab:{}}
    for icon in icons:
        raw   = icon["group"]  # "fa-solid" | "fa-regular" | "fa-brands"
        short = MAPPING.get(raw)
        name  = icon["name"]
        value = icon["value"]
        if short:
            Icons[short][name] = value
    return Icons

def write_to_free(icons: list[dict]):
    Icons    = icons_format(icons)
    replaced = MODEL_BYTES.replace(
        REWRITE_TARGET.encode(),
        json.dumps(Icons, indent=4).encode()
    )
    OUT_FILE.write_bytes(replaced)
    return Icons

# ── Main ───────────────────────────────────────────────────────────────────────

async def main():
    print()
    log_info("FontAwesome free icon scraper")
    log_step(f"Target  {DIM}{FONTAWESOME}{RESET}")
    log_step(f"Output  {DIM}{OUT_FILE}{RESET}")
    print()

    log_info("Launching browser …")
    page, browser, context = await init_browser(HEADLESS)
    log_ok("Browser ready")
    print()

    log_info("Fetching page 1 …")
    page_count, icons = await get_content(FONTAWESOME, context, True)

    if page_count == 0:
        log_error("Could not determine page count. Aborting.")
        await context.close()
        await browser.close()
        await page.stop()
        sys.exit(1)

    log_ok(f"Found {BOLD}{page_count}{RESET} pages")
    print()

    log_info("Scraping all pages …")
    log_progress(1, page_count, len(icons))

    for i in range(2, page_count + 1):
        page_url = f"{FONTAWESOME}&p={i}"
        icons   += await get_content(page_url, context)
        log_progress(i, page_count, len(icons))

    log_progress_done()
    log_ok("Scraping complete")
    print()

    await context.close()
    await browser.close()
    await page.stop()
    log_ok("Browser closed")
    print()

    log_info(f"Writing {DIM}{OUT_FILE.name}{RESET} …")
    Icons = write_to_free(icons)
    log_ok("File written")
    print()

    log_summary(Icons)
    print()

if __name__ == "__main__":
    asyncio.run(main())
