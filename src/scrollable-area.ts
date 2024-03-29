import { AddTick } from 'tick-manager';
import { getViewportDetails } from 'viewport-details';
import { PreventScrolling, ReEnableScrolling } from 'prevent-scrolling';
import * as EasingFunctions from 'js-easing-functions';

import { Position, ScrollableAreaOptions, MergedOptions, Easing } from './models';
import { USER_SCROLL_EVENTS } from './user-scroll-events';

const body = document.body;

const defaultOptions: ScrollableAreaOptions = {
  offset: [0, 0],
  duration: [200, 5000],
  easing: Easing.easeInOutQuart,
  cancelOnUserScroll: true,
  animate: true,
  autoDurationMultiplier: 2,
  onlyScrollIfNotInView: false,
};

export class ScrollableArea {
  private ticking: boolean = false;
  private _scrolling: boolean = false;
  private scrollFrom: Position;
  private scrollTo: Position;
  private duration: number;
  private timestamp: number;
  private scrollX: number;
  private scrollY: number;
  private easing: (elapsed: number, initialValue: number, amountOfChange: number, duration: number, s?: number) => number;
  private resolve: () => void;
  private reject: () => void;
  private userScrollingPrevented: boolean = false;

  constructor(private scrollContainer: HTMLElement | Window) {
    // Hack to ensure event listeners are removed correctly and their functions retain context of this. See:
    // https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind#answer-33386309
    this.cancelScroll = this.cancelScroll.bind(this) as () => void;
  }

  public ScrollToTarget(target: Position | HTMLElement, options?: ScrollableAreaOptions): Promise<void> {
    const scrollContainerOffsetLeft = this.scrollContainer instanceof Window ? 0 : this.scrollContainer.offsetLeft;
    const scrollContainerOffsetTop = this.scrollContainer instanceof Window ? 0 : this.scrollContainer.offsetTop;

    if (!Array.isArray(target)) {
      target = [
        target.offsetLeft - scrollContainerOffsetLeft,
        target.offsetTop - scrollContainerOffsetTop,
        target.offsetLeft + target.offsetWidth - scrollContainerOffsetLeft,
        target.offsetTop + target.offsetHeight - scrollContainerOffsetTop,
      ];
    }

    const { offset, easing, animate, duration, cancelOnUserScroll, autoDurationMultiplier, onlyScrollIfNotInView } = <MergedOptions>{
      ...defaultOptions,
      ...options,
    };

    this.setScrollPosition();

    this.easing = EasingFunctions[easing];

    this.scrollFrom = [this.scrollX, this.scrollY];
    this.scrollTo = [target[0] + offset[0], target[1] + offset[1]];

    let shouldScroll = true;

    if (onlyScrollIfNotInView) {
      const { width, height } =
        this.scrollContainer instanceof Window ? getViewportDetails() : this.scrollContainer.getBoundingClientRect();

      const x = this.scrollTo[0] - this.scrollX;
      const y = this.scrollTo[1] - this.scrollY;

      const leftNotInView = x > width || x < 0;
      const topNotInView = y > height || y < 0;

      if (target.length === 2) {
        shouldScroll = topNotInView || leftNotInView;
      } else {
        const right = target[2] + offset[0] - this.scrollX;
        const bottom = target[3] + offset[1] - this.scrollY;

        const rightNotInView = right > width || right < 0;
        const bottomNotInView = bottom > height || bottom < 0;

        shouldScroll = topNotInView || leftNotInView || bottomNotInView || rightNotInView;

        if (shouldScroll) {
          if (this.scrollTo[0] > this.scrollX && rightNotInView) {
            this.scrollTo[0] = target[2] + offset[0] - width;
          }

          if (this.scrollTo[1] > this.scrollY && bottomNotInView) {
            this.scrollTo[1] = target[3] + offset[1] - height;
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      if (!shouldScroll || this.scrollFrom === this.scrollTo) {
        resolve();
      } else {
        this.scrolling = true;
        this.resolve = resolve;
        this.reject = reject;

        if (animate) {
          let scrollHeight: number;
          let scrollWidth: number;

          if (this.scrollContainer instanceof Window) {
            const viewport = getViewportDetails();
            scrollWidth = body.offsetWidth - viewport.width;
            scrollHeight = body.offsetHeight - viewport.heightCollapsedControls;
          } else {
            scrollWidth = this.scrollContainer.scrollWidth;
            scrollHeight = this.scrollContainer.scrollHeight;
          }

          this.scrollTo[0] = Math.max(Math.min(this.scrollTo[0], scrollWidth), 0);
          this.scrollTo[1] = Math.max(Math.min(this.scrollTo[1], scrollHeight), 0);

          const distanceX = Math.abs(this.scrollFrom[0] - this.scrollTo[0]);
          const distanceY = Math.abs(this.scrollFrom[1] - this.scrollTo[1]);
          const autoDuration = Math.max(distanceX, distanceY) * autoDurationMultiplier;

          if (Array.isArray(duration)) {
            this.duration = Math.round(Math.min(Math.max(Math.round(autoDuration), duration[0]), duration[1]));
          } else {
            this.duration = duration;
          }

          this.timestamp = Date.now();

          if (cancelOnUserScroll) {
            this.addEventListeners();
          } else {
            this.userScrollingPrevented = true;
            PreventScrolling();
          }

          if (!this.ticking) {
            this.ticking = true;
            AddTick(this.tick.bind(this) as () => void);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          this.scrollContainer.scrollTo(...(this.scrollTo as any));

          this.onScrollEnd();
        }
      }
    });
  }

  private get scrolling(): boolean {
    return this._scrolling;
  }

  private set scrolling(scrolling: boolean) {
    this._scrolling = scrolling;
    window['autoScrolling'] = scrolling;
  }

  private setScrollPosition(): void {
    if (this.scrollContainer instanceof Window) {
      this.scrollX = window.pageXOffset;
      this.scrollY = window.pageYOffset;
    } else {
      this.scrollX = this.scrollContainer.scrollLeft;
      this.scrollY = this.scrollContainer.scrollTop;
    }
  }

  private addEventListeners(): void {
    USER_SCROLL_EVENTS.forEach(event => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.scrollContainer.addEventListener(event, this.cancelScroll);
    });
  }

  private removeEventListeners(): void {
    USER_SCROLL_EVENTS.forEach(event => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.scrollContainer.removeEventListener(event, this.cancelScroll);
    });
  }

  private cancelScroll(): void {
    this.scrolling = false;
    this.removeEventListeners();
    this.reject();
  }

  private tick(): void {
    this.setScrollPosition();

    if (this.scrolling) {
      this.scroll();
    }
  }

  private onScrollEnd(): void {
    if (this.userScrollingPrevented) {
      ReEnableScrolling();
    }

    this.removeEventListeners();

    this.scrolling = false;

    this.resolve();
  }

  private scroll(): void {
    const elapsed = Date.now() - this.timestamp;

    let x: number;
    let y: number;

    if (elapsed < this.duration) {
      x = this.calculateNextPosition(0, elapsed);
      y = this.calculateNextPosition(1, elapsed);
    } else {
      x = this.scrollTo[0];
      y = this.scrollTo[1];

      this.onScrollEnd();
    }

    if (this.scrollContainer instanceof Window) {
      this.scrollContainer.scrollTo(x, y);
    } else {
      this.scrollContainer.scrollLeft = x;
      this.scrollContainer.scrollTop = y;
    }
  }

  private calculateNextPosition(index: number, elapsed: number): number {
    const from = this.scrollFrom[index];
    const to = this.scrollTo[index];

    if (from > to) {
      return from - this.easing(elapsed, 0, from - to, this.duration);
    } else {
      return from + this.easing(elapsed, 0, to - from, this.duration);
    }
  }
}
