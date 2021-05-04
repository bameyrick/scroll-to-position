import { IScrollableArea, Position, Options } from './models';
import { ScrollableArea } from './scrollable-area';

const scrollableAreas: IScrollableArea[] = [];

export function ScrollTo(target: Position | HTMLElement, options?: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    const scrollContainer = options ? options.scrollContainer || window : window;

    let scrollableArea = scrollableAreas.find(a => a.element === scrollContainer);

    if (!scrollableArea) {
      scrollableArea = {
        element: scrollContainer,
        class: new ScrollableArea(scrollContainer),
      };

      scrollableAreas.push(scrollableArea);
    }

    scrollableArea.class
      .ScrollToTarget(target, options)
      .then(resolve)
      .catch(reject);
  });
}

export { Position, Options as IOptions, Easing } from './models';
