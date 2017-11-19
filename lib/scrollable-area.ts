import { AddTick } from 'tick-manager';
import * as Easings from 'js-easing-functions';

import { Position, IScrollableAreaOptions, IMergedOptions, Easing } from './models';
import { USER_SCROLL_EVENTS } from './user-scroll-events';

const win = window;

const defaultOptions: IScrollableAreaOptions = {
	offset: [0, 0],
	minDuration: 200,
	maxDuration: 5000,
	easing: Easing.easeInOutBack,
	cancelOnUserScroll: true,
	animate: true,
};

export class ScrollableArea {
	private ticking: boolean = false;
	private scrolling: boolean = false;
	private scrollFrom: Position;
	private scrollTo: Position;
	private duration: number;
	private timestamp: number;
	private scrollX: number;
	private scrollY: number;
	private easing: Function;
	private resolve: Function;

	constructor(private scrollContainer: HTMLElement | Window) {}

	public ScrollToTarget(target: Position | HTMLElement, options?: IScrollableAreaOptions): Promise<void> {
		if (!Array.isArray(target)) {
			target = [target.offsetLeft, target.offsetTop];
		}

		const { offset, easing, animate, minDuration, maxDuration, cancelOnUserScroll } = <IMergedOptions>Object.assign(
			defaultOptions,
			options
		);

		this.setScrollPosition();

		this.easing = Easings[easing];

		this.scrollFrom = [this.scrollX, this.scrollY];
		this.scrollTo = [target[0] + offset[0], target[1] + offset[1]];

		return new Promise(resolve => {
			if (this.scrollFrom === this.scrollTo) {
				resolve();
			} else {
				if (animate) {
					if (!this.ticking) {
						this.ticking = true;
						AddTick(this.tick.bind(this));
					}

					const distanceX = Math.abs(this.scrollFrom[0] - this.scrollTo[0]);
					const distanceY = Math.abs(this.scrollFrom[1] - this.scrollTo[1]);
					const maxDistance = Math.max(distanceX, distanceY);

					this.duration = Math.round(Math.min(Math.max(Math.round(maxDistance), minDuration), maxDuration));
					this.timestamp = Date.now();

					this.resolve = resolve;

					this.scrolling = true;

					if (cancelOnUserScroll) {
						this.addEventListeners();
					}
				} else {
					(<any>this.scrollContainer.scrollTo)(...this.scrollTo);

					resolve();
				}
			}
		});
	}

	private setScrollPosition(): void {
		if (this.scrollContainer instanceof Window) {
			this.scrollX = win.pageXOffset;
			this.scrollY = win.pageYOffset;
		} else {
			this.scrollX = (<HTMLElement>this.scrollContainer).scrollLeft;
			this.scrollY = (<HTMLElement>this.scrollContainer).scrollTop;
		}
	}

	private addEventListeners(): void {
		USER_SCROLL_EVENTS.forEach(event => {
			this.scrollContainer.addEventListener(event, this.cancelScroll.bind(this));
		});
	}

	private removeEventListeners(): void {
		USER_SCROLL_EVENTS.forEach(event => {
			this.scrollContainer.removeEventListener(event, this.cancelScroll.bind(this));
		});
	}

	private cancelScroll(): void {
		this.scrolling = false;
		this.removeEventListeners();
	}

	private tick(): void {
		this.setScrollPosition();

		if (this.scrolling) {
			this.scroll();
		}
	}

	private scroll(): void {
		const elapsed = Date.now() - this.timestamp;

		let x;
		let y;

		if (elapsed < this.duration) {
			x = this.calculateNextPosition(0, elapsed);
			y = this.calculateNextPosition(1, elapsed);
		} else {
			this.scrolling = false;

			x = this.scrollTo[0];
			y = this.scrollTo[1];

			this.removeEventListeners();

			this.resolve();
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
