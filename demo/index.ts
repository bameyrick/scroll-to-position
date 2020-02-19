import { ScrollTo, IOptions } from '../src/index';

const input = <HTMLInputElement>document.querySelector('.js-position');
const button = <HTMLElement>document.querySelector('.js-button');
const animate = <HTMLInputElement>document.querySelector('.js-animate');
const scrollIfNotInView = <HTMLInputElement>document.querySelector('.js-not-in-view');

button.addEventListener('click', scroll);

input.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    event.stopImmediatePropagation();
    scroll();
  }
});

const options: IOptions = {};

animate.addEventListener('change', () => (options.animate = animate.checked));
scrollIfNotInView.addEventListener('change', () => (options.onlyScrollIfNotInView = scrollIfNotInView.checked));

function scroll(): void {
  const y = input.value ? parseInt(input.value, 10) : 0;
  ScrollTo([0, y], options)
    .then(() => console.log('Scrolling completed'))
    .catch(() => console.log('User interrupted scrolling'));
}
