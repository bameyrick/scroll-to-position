import { ScrollTo } from '../src/index';

const input = <HTMLInputElement>document.querySelector('.ScrollToControl__input');
const button = <HTMLElement>document.querySelector('.ScrollToControl__button');

button.addEventListener('click', scroll);
input.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    event.stopImmediatePropagation();
    scroll();
  }
});

function scroll(): void {
  const y = input.value ? parseInt(input.value, 10) : 0;
  ScrollTo([0, y])
    .then(() => console.log('Scrolling completed'))
    .catch(() => console.log('User interupted scrolling'));
}
