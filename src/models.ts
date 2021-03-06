import { ScrollableArea } from './scrollable-area';

export interface IScrollableArea {
  class: ScrollableArea;
  element: HTMLElement | Window;
}

export interface ScrollableAreaOptions {
  offset?: Position;
  duration?: DurationRange | number;
  easing?: Easing;
  cancelOnUserScroll?: boolean;
  animate?: boolean;
  autoDurationMultiplier?: number;
  onlyScrollIfNotInView?: boolean;
}

export interface Options extends ScrollableAreaOptions {
  scrollContainer?: HTMLElement | Window;
}

export interface MergedOptions {
  offset: Position;
  duration: DurationRange | number;
  easing: Easing;
  cancelOnUserScroll: boolean;
  animate: boolean;
  autoDurationMultiplier: number;
  onlyScrollIfNotInView: boolean;
}

export type Position = [number, number] | [number, number, number, number];

export type DurationRange = [number, number];

export enum Easing {
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInCubic = 'easeInCubic',
  easeOutCubic = 'easeOutCubic',
  easeInOutCubic = 'easeInOutCubic',
  easeInQuart = 'easeInQuart',
  easeOutQuart = 'easeOutQuart',
  easeInOutQuart = 'easeInOutQuart',
  easeInQuint = 'easeInQuint',
  easeOutQuint = 'easeOutQuint',
  easeInOutQuint = 'easeInOutQuint',
  easeInSine = 'easeInSine',
  easeOutSine = 'easeOutSine',
  easeInOutSine = 'easeInOutSine',
  easeInExpo = 'easeInExpo',
  easeOutExpo = 'easeOutExpo',
  easeInOutExpo = 'easeInOutExpo',
  easeInCirc = 'easeInCirc',
  easeOutCirc = 'easeOutCirc',
  easeInOutCirc = 'easeInOutCirc',
  easeInElastic = 'easeInElastic',
  easeOutElastic = 'easeOutElastic',
  easeInOutElastic = 'easeInOutElastic',
  easeInBack = 'easeInBack',
  easeOutBack = 'easeOutBack',
  easeInOutBack = 'easeInOutBack',
  easeInBounce = 'easeInBounce',
  easeOutBounce = 'easeOutBounce',
  easeInOutBounce = 'easeInOutBounce',
}
