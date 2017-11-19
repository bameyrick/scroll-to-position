import { IScrollableArea, Position, IOptions } from './models';
import { ScrollableArea } from './scrollable-area';

const scrollableAreas: IScrollableArea[] = [];

export function ScrollTo(target: Position | HTMLElement, options?: IOptions): Promise<void> {
	return new Promise(resolve => {
		const scrollContainer = options ? options.scrollContainer || window : window;

		let scrollableArea = scrollableAreas.find(a => a.element === scrollContainer);

		if (!scrollableArea) {
			scrollableArea = <IScrollableArea>{
				element: scrollContainer,
				class: new ScrollableArea(scrollContainer),
			};

			scrollableAreas.push(scrollableArea);
		}

		scrollableArea.class.ScrollToTarget(target, options).then(resolve);
	});
}

export { Position, IOptions } from './models';
