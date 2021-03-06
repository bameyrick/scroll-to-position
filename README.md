# scroll-to-position

Animate scroll to either an x, y, or x and y position in any scrollable viewport with customisable easing.

[**Demo**](https://scroll-to-position.netlify.com/)

[![GitHub release](https://img.shields.io/github/release/bameyrick/scroll-to-position.svg)](https://github.com/bameyrick/scroll-to-position/releases)
[![Build Status](https://travis-ci.com/bameyrick/scroll-to-position.svg?branch=master)](https://travis-ci.com/bameyrick/scroll-to-position)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c22654eec6b4e92b80c40a19d3a26fa)](https://www.codacy.com/manual/bameyrick/scroll-to-position)

## Install

You can install via npm or yarn.

### npm

```bash
npm install --save scroll-to-position
```

### yarn

```bash
yarn add scroll-to-position
```

## Usage

### Importing

You can import using ES6 imports.

```javascript
import { ScrollTo } from 'scroll-to-position';
```

### Arguments

ScrollTo accepts two arguments:

**target**: either a position ([positionX, positionY]) or a HTML Element (e.g. a reference to a div).

**options** _(optional)_: an object of configuration options - see the options section below.

#### Examples

**Position**

```javascript
ScrollTo([0, 100]);
```

**Element**

```javascript
const myElement = document.querySelector('.MyElement');
ScrollTo(myElement);
```

_Note: if you're using TypeScript you will most likely need to cast your element to a HTMLElement, as document.querySelector returns a Element type._

## Callback

Calling `ScrollTo` returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), so it is possible to run your own code after scrolling has completed.

```javascript
ScrollTo([0, 100]).then(() => console.log('Scrolling completed'));
```

If `cancelOnUserScroll` is enabled and the user interrupts scrolling, then the promise rejects and can be caught using [Promise.prototype.catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

```javascript
ScrollTo([0, 100])
  .then(() => console.log('Scrolling completed'))
  .catch(() => console.log('User interrupted scrolling'));
```

## Options

When calling ScrollTo you can provide an options object, with values to override the defaults.

### Option Parameters

| Parameter              | Type                                                  | Description                                                                                                                                                                                                                                                | Default                                          |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| scrollContainer        | HTMLElement or Window                                 | The area to scroll. e.g. window or a div with overflow auto                                                                                                                                                                                                | window                                           |
| offset                 | Position ([number, number])                           | If your target is a HTMLElement you may want to provide an offset to prevent scrolling right to the edge of the element                                                                                                                                    | [0,0]                                            |
| duration               | DurationRange ([number, number]) or Duration (number) | Either a DurationRange ([minDuration, maxDuration]) or a set duration (all values in milliseconds). If you provide a range the scroll distance (providing it's no less than the minDuration and no more than the maxDuration will be used as the duration) | [200, 5000]                                      |
| easing                 | string                                                | The easing function the animation will use. The easing's available can be seen in my js-easing-functions repo (https://github.com/bameyrick/js-easing-functions)                                                                                           | https://github.com/bameyrick/js-easing-functions |
| cancelOnUserScroll     | boolean                                               | Whether the scroll animation should stop when the user scrolls                                                                                                                                                                                             | true                                             |
| animate                | boolean                                               | Whether ScrollTo should animate to the target, or jump straight there with no animation                                                                                                                                                                    | true                                             |
| autoDurationMultiplier | number                                                | If duration is to picked automatically (between DurationRange), multiply the distance to travel by this value to get the duration                                                                                                                          | 2                                                |
| onlyScrollIfNotInView  | boolean                                               | Only scroll if the target is not within the viewport of the scrollable area. If the provided target is a DOM element then it will check to see if the element is fully within the scroll area.                                                             | false                                            |

### Example of providing options

```javascript
ScrollTo([0, 100], {
  duration: [300, 1000],
  easing: 'easeInOutSine',
});
```

Using the easing enum in TypeScript

```typescript
import { ScrollTo, Easing } from 'scroll-to-position';

ScrollTo([0, 100], {
  duration: [300, 1000],
  easing: Easing.easeInQuad,
});
```

## Extras

An `autoScroll` boolean is added to the window which you can use in your scroll event listeners to check if the window is being autoScrolled by this package.
