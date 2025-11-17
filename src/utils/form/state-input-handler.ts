class StateInputHandler {
  private input: HTMLInputElement;
  private feedback: HTMLElement;
  private validStates: string[];

  constructor(inputId: string) {
    this.input = document.getElementById(inputId) as HTMLInputElement;
    this.feedback = this.input
      .closest('.ac-field-wrapper')
      ?.querySelector('.ac-feedback') as HTMLElement;
    this.validStates = [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
    ];

    this.initializeStateValidation();
  }

  private initializeStateValidation(): void {
    this.input.addEventListener('blur', () => {
      this.validateStateInput();
    });

    this.input.addEventListener('input', () => {
      this.input.value = this.input.value.toUpperCase();
      this.input.setCustomValidity('');
      this.feedback.textContent = '';
    });
  }
  private validateStateInput(): void {
    const state = this.input.value.toUpperCase();

    if (state.length < 2) {
      this.input.setCustomValidity('Input is too short.');
      this.feedback.textContent = 'Input is too short.';
    } else if (!this.validStates.includes(state)) {
      this.input.setCustomValidity('Invalid state.');
      this.feedback.textContent = 'Invalid state.';
    } else {
      this.input.setCustomValidity('');
      this.feedback.textContent = 'Perfect!';
    }
    this.input.classList.add('validated');
  }
}
export { StateInputHandler };
