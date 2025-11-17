class FormInput {
  protected _value: any;
  public input: HTMLInputElement;
  public message: HTMLElement | undefined;
  public valid: boolean;
  public validMessages: string[];
  public invalidMessages: string[];
  public subValidate: () => boolean;
  private Json: () => JSON;

  constructor({
    input,
    message,
    validateFunction = () => this.input.validity.valid,
    JsonFunction,
  }: {
    input: HTMLInputElement;
    message: HTMLInputElement | undefined;
    validateFunction: () => boolean;
    JsonFunction: () => JSON;
  }) {
    this.input = input;
    this.message = message;

    this.valid = false;
    this.validMessages = [
      'All set',
      'Perfect',
      'Great',
      'Success',
      'Excellent!',
      'Nicely done!',
      'Awesome',
      'Wonderful!',
      'Fantastic!',
      'Spot on',
    ];
    this.invalidMessages = [
      'Invalid Value',
      'Invalid Value',
      'Invalid Value',
      'Invalid Value',
      'Oops! Something went wrong.',
      "Hmm, that doesn't seem right. Try again?",
      "Uh-oh! Looks like there's a typo. Please re-enter.",
      'Not quite! Please double-check your entry.',
      'Error detected. Please ensure your input is correct.',
      "That didn't work. Let's give it another shot.",
      "We're having trouble with that entry. Could you verify it?",
      "Looks like there's an error. Mind trying once more?",
      "That's not matching up. Please enter the correct details.",
    ];

    this.subValidate = validateFunction;
    this.Json = JsonFunction;
    this.init();
  }

  protected init() {
    console.log('Create Input');
    this.input.addEventListener('input', () => {
      this.value = this.input.value;
    });
    this.input.addEventListener('blur', () => {
      this.value = this.input.value;
      const required = this.input.required;

      if (this.input.value.trim() === '' && required === false) {
        this.input.setCustomValidity('');
        this.input.classList.remove('validated');
        if (this.message) this.message.innerText = '';
      } else if (this.valid === false) {
        if (this.input.validity) this.input.setCustomValidity('Invalid Value');
        if (this.message) this.message.innerText = this.getValidMessage();
      } else {
        if (!this.input.validity) this.input.setCustomValidity('');
        if (this.message) this.message.innerText = this.getValidMessage();
      }
    });
  }

  get value(): any {
    return this._value;
  }

  set value(newValue: any) {
    this.validate(newValue);
    if (this.valid) {
      this._value = newValue;
      this.input.value = newValue.toString();
    }
    console.log('Value', this.value);
  }

  private getValidMessage() {
    if (this.valid) {
      if (Math.random() < 0.3) return '';
      const index = Math.floor(Math.pow(Math.random(), 2) * this.validMessages.length);
      return this.validMessages[index];
    } else {
      const index = Math.floor(Math.pow(Math.random(), 2) * this.invalidMessages.length);
      return this.invalidMessages[index];
    }
  }

  public toString(): string {
    return `${this.value}`;
  }

  public toJSON(): JSON {
    if (this.input.value !== this.value) this.value = '';

    return this.Json();
  }

  public isValid(): boolean {
    return this.valid;
  }

  public validate(newValue: any) {
    const value = this.input.value;
    this.input.value = newValue.toString();
    this.valid = this.input.validity.valid;
    this.valid = this.subValidate();
    this.input.value = value;
    console.log('Valid', this.valid);
  }
}

export { FormInput };
