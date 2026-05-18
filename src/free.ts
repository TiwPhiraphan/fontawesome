import { createElement } from 'react'
import type { CSSProperties } from 'react'
import * as solid from '@fortawesome/free-solid-svg-icons'
import * as regular from '@fortawesome/free-regular-svg-icons'
import * as brands from '@fortawesome/free-brands-svg-icons'

type RawIcon = { prefix: string; iconName: string }

type IconsOf<T> = {
  [K in keyof T as T[K] extends { iconName: infer N extends string } ? N : never]: RawIcon
}

export const byPrefixAndName = {
  fas: solid   as unknown as IconsOf<typeof solid>,
  far: regular as unknown as IconsOf<typeof regular>,
  fab: brands  as unknown as IconsOf<typeof brands>,
}

type SizeOption =
  | 'xs' | 'sm' | 'lg'
  | '1x' | '2x' | '3x' | '4x' | '5x'
  | '6x' | '7x' | '8x' | '9x' | '10x'

type AnimationOption = 'spin' | 'pulse'
type RotateOption = '90' | '180' | '270'
type FlipOption = 'horizontal' | 'vertical' | 'both'
type PullOption = 'left' | 'right'

type IconProps = {
  icon: RawIcon
  size?: SizeOption
  fixedWidth?: boolean
  animation?: AnimationOption
  rotate?: RotateOption
  flip?: FlipOption
  pull?: PullOption
  border?: boolean
  inverse?: boolean
  stack?: '1x' | '2x'
  className?: string
  style?: CSSProperties
  title?: string
  'aria-hidden'?: boolean
  'aria-label'?: string
}

export function FontAwesomeIcon({
  icon,
  size,
  fixedWidth,
  animation,
  rotate,
  flip,
  pull,
  border,
  inverse,
  stack,
  className,
  ...rest
}: IconProps) {
  const classes = [
    icon.prefix,
    `fa-${icon.iconName}`,
    size       && `fa-${size}`,
    fixedWidth && 'fa-fw',
    animation  && `fa-${animation}`,
    rotate     && `fa-rotate-${rotate}`,
    flip       && `fa-flip-${flip}`,
    pull       && `fa-pull-${pull}`,
    border     && 'fa-border',
    inverse    && 'fa-inverse',
    stack      && `fa-stack-${stack}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return createElement('i', { className: classes, ...rest })
}
