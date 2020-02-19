import { AddTick } from 'tick-manager';
import { GetViewportDetails } from 'viewport-details';
import { PreventScrolling, ReEnableScrolling } from 'prevent-scrolling';
import * as EasingFunctions from 'js-easing-functions';

import { Position, IScrollableAreaOptions, IMergedOptions, Easing } from './models';
import { USER_SCROLL_EVENTS } from './user-scroll-events';

const win = window;
const body = document.body;

const defaultOptions: IScrollableAreaOptions = {
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
  private easing: Function;
  private resolve: Function;
  private reject: Function;
  private userScrollingPrevented: boolean = false;

  constructor(private scrollContainer: HTMLElement | Window) {
    // Hack to ensure event listeners are removed correctly and their functions retain context of this. See:
    // https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind#answer-33386309
    this.cancelScroll = this.cancelScroll.bind(this);
  }

  public ScrollToTarget(target: Position | HTMLElement, options?: IScrollableAreaOptions): Promise<void> {
    if (!Array.isArray(target)) {
      target = [target.offsetLeft, target.offsetTop];
    }

    const { offset, easing, animate, duration, cancelOnUserScroll, autoDurationMultiplier, onlyScrollIfNotInView } = <IMergedOptions>{
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
        this.scrollContainer instanceof Window ? GetViewportDetails() : this.scrollContainer.getBoundingClientRect();

      const x = this.scrollTo[0] - this.scrollX;
      const y = this.scrollTo[1] - this.scrollY;

      shouldScroll = x > width || x < 0 || y > height || y < 0;
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
            const viewport = GetViewportDetails();
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
            AddTick(this.tick.bind(this));
          }
        } else {
          (<any>this.scrollContainer.scrollTo)(...this.scrollTo);

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
    (<any>win).autoScrolling = scrolling;
  }

  private setScrollPosition(): void {
    if (this.scrollContainer instanceof Window) {
      this.scrollX = win.pageXOffset;
      this.scrollY = win.pageYOffset;
    } else {
      this.scrollX = this.scrollContainer.scrollLeft;
      this.scrollY = this.scrollContainer.scrollTop;
    }
  }

  private addEventListeners(): void {
    USER_SCROLL_EVENTS.forEach(event => {
      this.scrollContainer.addEventListener(event, this.cancelScroll);
    });
  }

  private removeEventListeners(): void {
    USER_SCROLL_EVENTS.forEach(event => {
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
