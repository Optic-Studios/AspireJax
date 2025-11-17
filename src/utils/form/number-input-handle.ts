class NumberInputHandler {
  private parent: HTMLElement;
  public input: HTMLInputElement | null;
  private _value: number | string;
  private minusButton: HTMLElement | null;
  private plusButton: HTMLElement | null;
  public min: number | null;
  public max: number | null;
  public required: boolean;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.input = this.parent.querySelector('input') || null;
    this._value = '';
    this.minusButton = this.parent.querySelector('[ac-number-element="minus-button"]') || null;
    this.plusButton = this.parent.querySelector('[ac-number-element="plus-button"]') || null;
    this.min = null;
    this.max = null;
    this.required = this.input?.hasAttribute('required') || false;

    this.init();
  }

  get value(): number | string {
    return this._value;
  }

  set value(newValue: number | string) {
    if (this.input === null) return;
    if (this.min !== null && +this._value < this.min) {
      this._value = this.min;
      this.input.value = this._value.toString();
    } else if (this.max !== null && +this._value > this.max) {
      this._value = this.max;
      this.input.value = this._value.toString();
    } else {
      this._value = newValue;
      this.input.value = this._value.toString();
    }

    if (this.minusButton !== null) {
      if (this.min !== null && +this._value <= this.min) {
        this.minusButton.setAttribute('disabled', 'true');
      } else {
        this.minusButton.removeAttribute('disabled');
      }
    }
    if (this.plusButton !== null) {
      if (this.max !== null && +this._value >= this.max) {
        this.plusButton.setAttribute('disabled', 'true');
      } else {
        this.plusButton.removeAttribute('disabled');
      }
    }
  }

  private init() {
    if (this.input === null) return;

    this.input?.addEventListener('input', () => {
      if (this.input === null || this.input.value === null) return;
      this.value = this.input.value;
    });

    this.min =
      this.input && this.input.hasAttribute('min') ? Number(this.input.getAttribute('min')) : null;
    this.max =
      this.input && this.input.hasAttribute('max') ? Number(this.input.getAttribute('max')) : null;

    this.minusButton?.addEventListener('click', () => {
      if (this.value === '') this.value = 0;
      const tempValue = Number(this.value) - 1;

      if ((this.min !== null && tempValue >= this.min) || this.min === null) {
        this.value = tempValue;
      }
    });

    this.plusButton?.addEventListener('click', () => {
      if (this.value === '') this.value = 0;
      const tempValue = Number(this.value) + 1;

      if ((this.max !== null && tempValue <= this.max) || this.max === null) {
        this.value = tempValue;
      }
    });
  }

  public validate() {
    if (this.required && (this.value === '' || this.value === null)) {
      return false;
    }

    if (
      (this.min !== null &&
        this.max !== null &&
        Number(this.value) >= this.min &&
        Number(this.value) <= this.max) ||
      (this.min !== null && Number(this.value) >= this.min) ||
      this.min === null
    ) {
      return true;
    }
    return false;
  }

  public getValue() {
    if (this.input === null) return false;

    const newJson = {
      question_id: this.parent.id,
      answer: {
        choice_id: this.input.id.toString(),
        scale_id: this.input.value.toString(),
      },
    };

    return newJson;
  }
}

export { NumberInputHandler };
