import intlTelInput from 'intl-tel-input';
import { generateValidationMessage } from './validation-message';

type ErrorMap = string[];

class PhoneNumberInputHandler {
  private errorMap: ErrorMap;
  private input: HTMLInputElement;

  constructor(input: HTMLInputElement) {
    this.errorMap = [
      'Invalid number',
      'Invalid country code',
      'The phone number is too short',
      'The phone number is too long',
      'Invalid number',
    ];
    this.input = input;
    this.init();
  }

  private formatPhoneNumber(value: string): string {
    const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    return !x || !x[2] ? (x ? x[1] : '') : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  }

  private init(): void {
    if (!this.input) return;
    this.input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement; // Safely cast e.target to HTMLInputElement
      if (target) {
        // Check if target is not null
        target.value = this.formatPhoneNumber(target.value);
      }
    });

    const iti = intlTelInput(this.input, {
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      initialCountry: 'us',
      formatAsYouType: false,
      preferredCountries: ['us', 'ca'],
    });

    this.repositionLabelAndMessage(this.input);
    this.addValidationListeners(this.input, iti);
  }

  private repositionLabelAndMessage(input: HTMLInputElement): void {
    const label = input.closest('.ac-field-wrapper')?.querySelector('label');
    if (label) {
      input.parentNode?.insertBefore(label, input.nextSibling);
    }
    const message = input.closest('.ac-field-wrapper')?.querySelector('.ac-feedback');
    if (message) {
      input.parentNode?.insertBefore(message, label?.nextSibling);
    }
  }

  private addValidationListeners(input: HTMLInputElement, iti: any): void {
    const parent = input.closest('.ac-field-wrapper');
    if (parent == null) return;

    const message = input
      .closest('.ac-field-wrapper')
      ?.querySelector('.ac-feedback') as HTMLElement;

    input.addEventListener('blur', () => {
      if (input.value.trim() === '' && parent !== null) {
        input.setCustomValidity('');
        if (message) message.innerText = '';
      } else {
        const isValid = iti.isValidNumber();
        if (!isValid) {
          input.setCustomValidity('Invalid phone number');
          const error = iti.getValidationError();
          parent.classList.remove('valid');
          parent.classList.add('invalid');
          if (message) message.innerText = this.errorMap[error] || 'Invalid input';
        } else {
          input.setCustomValidity('');
          parent.classList.add('valid');
          parent.classList.remove('invalid');
          if (message) message.innerText = generateValidationMessage();
        }
      }
    });

    input.addEventListener('input', () => {
      input.classList.remove('validated');
      input.setCustomValidity('');
      if (message) message.innerText = '';
    });

    input.addEventListener('change', () => {
      input.classList.remove('validated');
      if (message) message.innerText = '';
    });
  }

  public validate() {}

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

export { PhoneNumberInputHandler };
