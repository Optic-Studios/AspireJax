import { DateInputHandler } from '$utils/form/date-input-handler';

class dateInputConstructor {
  private _value: number;
  private intitalValue: number;
  public length: number;
  public input: HTMLInputElement;
  public maxLength: number;
  public min: number;
  public max: number;
  public parentInputhandler: DateInputHandler;

  public validate: (value: number, errorHandle: boolean | null) => boolean | null;

  constructor(
    parentInputhandler: DateInputHandler,
    intitalValue: number,
    input: HTMLInputElement,
    maxLength: number,
    minValue: number,
    maxValue: number,
    validateFunction: (value: number, errorHandle: boolean | null) => boolean | null = () => true
  ) {
    this._value = intitalValue;
    this.intitalValue = intitalValue;
    this.length = 0;
    this.input = input;
    this.maxLength = maxLength;
    this.min = minValue;
    this.max = maxValue;
    this.parentInputhandler = parentInputhandler;
    this.validate = validateFunction;

    this.init();
  }
  private init() {
    this.input.addEventListener('click', (event) => {
      event.stopPropagation();
      this.parentInputhandler.openModal();
    });
    this.input.addEventListener('input', (event) => {
      event.stopPropagation();
      this.restrictNonNumericInput();
      this.updateValue();
      this.parentInputhandler.updateModal();
      this.parentInputhandler.setupDatePicker();

      if (this.validate(parseInt(this.inputValue.toString()), false)) {
        if (this.parentInputhandler.month.inputValue === '') {
          this.parentInputhandler.month.input.focus();
        } else if (
          this.parentInputhandler.month.inputValue !== '' &&
          this.parentInputhandler.day.inputValue === ''
        ) {
          this.parentInputhandler.day.input.focus();
        } else if (
          this.parentInputhandler.month.inputValue !== '' &&
          this.parentInputhandler.day.inputValue !== ''
        ) {
          this.parentInputhandler.year.input.focus();
        } else if (
          this.parentInputhandler.month.inputValue !== '' &&
          this.parentInputhandler.day.inputValue !== ''
        ) {
          this.parentInputhandler.closeModal();
        }
      } else if (this.validate(parseInt(this.inputValue.toString()), false) !== null) {
        console.error(
          'An input had an invalid value of ' + this.inputValue + '. The input has been reset.'
        );
        this.value = '';
      }
    });
    this.input.addEventListener('keypress', this.preventNonNumericInput);
  }

  private restrictNonNumericInput() {
    this.input.value = this.input.value.replace(/[^0-9]/g, '');
  }

  private preventNonNumericInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number | string) {
    this.input.value = newValue.toString();
    this.length = newValue.toString().length;

    if (newValue === '') {
      newValue = this.intitalValue;
    } else {
      newValue = parseInt(newValue.toString());
    }

    if (this.validate(newValue, true)) {
      this._value = newValue;
      sessionStorage.setItem(this.input.id, this.value.toString());
    }
  }

  get inputValue(): number | string {
    if (this.input.value !== '') {
      return parseInt(this.input.value);
    }
    return '';
  }

  set inputValue(newValue: number | string) {
    if (newValue !== '') {
      this.input.value = newValue.toString();
    }
    this.input.value = '';
    sessionStorage.setItem(this.input.id, '');
  }

  public updateValue() {
    this.value = this.input.value;
  }
}

export { dateInputConstructor };
