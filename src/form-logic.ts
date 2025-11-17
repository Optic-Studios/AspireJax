import { DateInputHandler } from '$utils/form/date-input-handler';
import { FormNavigator } from '$utils/form/form-navigation';
import { NumberInputHandler } from '$utils/form/number-input-handle';
import { PhoneNumberInputHandler } from '$utils/form/phone-input-handler';
import { SelectInputHandler } from '$utils/form/select-input-handler';
import { SliderInputHandler } from '$utils/form/slider-input-handler';
import { StateInputHandler } from '$utils/form/state-input-handler';
import { FormInput } from '$utils/form/inputs/input-constructor';

document.addEventListener('DOMContentLoaded', function () {
  //Form Navigation
  const headers = document.querySelectorAll('h2, h3') as NodeListOf<HTMLElement>;
  const backBtn = document.getElementById('form-back-bttn') as HTMLElement;
  const nextBtn = document.getElementById('form-next-bttn') as HTMLElement;
  const submitBtn = document.getElementById('form-submit-bttn') as HTMLElement;
  const formNavigator = new FormNavigator(headers, backBtn, nextBtn, submitBtn);

  //Input Logic
  const stateInputHandler = new StateInputHandler('stateInput');

  const selectHandlers = document.querySelectorAll('.ac-select-wrapper') as NodeListOf<HTMLElement>;
  selectHandlers.forEach((input: HTMLElement) => new SelectInputHandler(input));

  //Phone Input Logic
  const phoneNumberHandler = document.querySelectorAll(
    'input[type="tel"]'
  ) as NodeListOf<HTMLInputElement>;
  phoneNumberHandler.forEach((input: HTMLInputElement) => new PhoneNumberInputHandler(input));

  //Date Input/Picker Logic
  const dateInputHandlers = document.querySelectorAll(
    '[ac-date-element="parent"]'
  ) as NodeListOf<HTMLElement>;
  dateInputHandlers.forEach((input: HTMLElement) => new DateInputHandler(input));

  //Slider Input Logic
  const sliderInputHandlers = document.querySelectorAll(
    '[ac-slider-element="parent"]'
  ) as NodeListOf<HTMLElement>;
  sliderInputHandlers.forEach((input: HTMLElement) => new SliderInputHandler(input));

  //Number Input Logic
  const numberInputHandlers = document.querySelectorAll(
    '[ac-number-element="parent"]'
  ) as NodeListOf<HTMLElement>;
  numberInputHandlers.forEach((input: HTMLElement) => new NumberInputHandler(input));
});
