import { ScrollTo } from '../src/index';

const input = <HTMLInputElement>document.querySelector('.ScrollToControl__input');
const button = <HTMLElement>document.querySelector('.ScrollToControl__button');

button.addEventListener('click', () => {
	const y = input.value ? parseInt(input.value, 10) : 0;
	ScrollTo([0, y]);
});
