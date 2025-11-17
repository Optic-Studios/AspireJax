import { dateInputConstructor } from '$utils/form/inputs/dateInput';

const monthNames: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class DateInputHandler {
  private parent: HTMLElement;
  private wrapper: HTMLElement;
  private datePicker: HTMLElement;
  private monthSelect: HTMLElement;
  private monthDropdown: HTMLElement;
  private yearSelect: HTMLElement;
  private yearDropdown: HTMLElement;
  private allSelectElements: NodeListOf<Element>;
  private decadeLeftButton: HTMLElement;
  private decadeRightButton: HTMLElement;
  private decadeDisplay: HTMLElement;
  private yearOptions: HTMLElement;
  public year: dateInputConstructor;
  public month: dateInputConstructor;
  public day: dateInputConstructor;
  public startDecadeYear: number;
  private startBool: boolean;
  public required: boolean;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    //Date Input Elements
    this.wrapper = this.parent.querySelector('[ac-date-element="date-input"]') as HTMLElement;

    //if (this.wrapper == null) return;

    //DatePicker Elements
    this.datePicker = this.parent.querySelector(
      '[ac-date-element="datepicker-modal"]'
    ) as HTMLElement;
    this.monthSelect = this.datePicker.querySelector(
      '[ac-date-element="month-select"]'
    ) as HTMLInputElement;
    this.monthDropdown = this.datePicker.querySelector(
      '[ac-date-element="month-dropdown"]'
    ) as HTMLInputElement;
    this.yearSelect = this.datePicker.querySelector(
      '[ac-date-element="year-select"]'
    ) as HTMLInputElement;
    this.yearDropdown = this.datePicker.querySelector(
      '[ac-date-element="year-dropdown"]'
    ) as HTMLInputElement;
    this.allSelectElements = this.datePicker.querySelectorAll(
      '.ac-datepicker-header-select'
    ) as NodeListOf<Element>;
    this.decadeLeftButton = this.datePicker.querySelector(
      '[ac-date-element="decade-left"]'
    ) as HTMLElement;
    this.decadeRightButton = this.datePicker.querySelector(
      '[ac-date-element="decade-right"]'
    ) as HTMLInputElement;
    this.decadeDisplay = this.datePicker.querySelector(
      '[ac-date-element="decade-display"]'
    ) as HTMLInputElement;
    this.yearOptions = this.datePicker.querySelector(
      '[ac-date-element="year-options"]'
    ) as HTMLInputElement;

    //Data
    this.year = new dateInputConstructor(
      this,
      new Date().getFullYear(),
      this.wrapper.querySelector('[ac-date-element="year-input"]') as HTMLInputElement,
      4,
      new Date().getFullYear() - 100 - (new Date().getFullYear() % 100),
      new Date().getFullYear() + 10 - (new Date().getFullYear() % 10) + 9,
      this.validateYear.bind(this)
    );
    this.month = new dateInputConstructor(
      this,
      new Date().getMonth() + 1,
      this.wrapper.querySelector('[ac-date-element="month-input"]') as HTMLInputElement,
      2,
      1,
      12,
      this.validateMonth.bind(this)
    );
    this.day = new dateInputConstructor(
      this,
      new Date().getDate(),
      this.wrapper.querySelector('[ac-date-element="day-input"]') as HTMLInputElement,
      2,
      1,
      31,
      this.validateDay.bind(this)
    );

    this.startDecadeYear = this.year.value - (this.year.value % 10);
    this.startBool = false;
    this.required = this.year.input.hasAttribute('required');
    this.init();
  }

  private init(): void {
    this.setupDatePicker();
    this.setupMonthYearDropdowns();
    this.closeModal(false);
    this.updateDynamicModalPosition();

    document.addEventListener('click', (event) => {
      const modal = this.datePicker;
      if (modal && !modal.contains(event.target)) {
        this.closeModal(false);
      }
    });

    this.wrapper.addEventListener('click', (event) => {
      event.stopPropagation();
      this.startBool = false;
      this.openModal();
    });
  }

  public setupDatePicker(): void {
    const calendarContainer = this.datePicker.querySelector('.ac-datepicker-days-wrapper');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';
    const monthYearDisplay = this.datePicker.querySelector('[ac-date-element="month-select"] div');
    const yearDisplay = this.datePicker.querySelector('[ac-date-element="year-select"] div');
    if (monthYearDisplay && yearDisplay) {
      monthYearDisplay.textContent = monthNames[this.month.value - 1];
      yearDisplay.textContent = `${this.year.value}`;
    }

    const firstDay = new Date(this.year.value, this.month.value - 1, 1);
    const daysInMonth = new Date(this.year.value, this.month.value, 0).getDate();

    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarContainer.innerHTML += '<div class="ac-datepicker-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('ac-datepicker-day');
      dayElement.textContent = `${day}`;

      // Mark the selected day
      if (day === this.day.value) {
        dayElement.classList.add('selected');
      }

      dayElement.addEventListener('click', () => {
        this.day.value = day;
        this.updateDate(this.year.value, this.month.value, day);

        if (day === this.day.value) {
          this.clearSelectedDays();
          dayElement.classList.add('selected');
        }
        this.closeModal();
      });
      calendarContainer.appendChild(dayElement);
    }
  }

  // Clear selected days
  private clearSelectedDays(): void {
    const selectedDays = this.datePicker.querySelectorAll('.ac-datepicker-day.selected');
    selectedDays.forEach((day) => day.classList.remove('selected'));
  }

  // Setup month and year dropdowns
  private setupMonthYearDropdowns(): void {
    this.monthSelect?.addEventListener('click', () => {
      this.toggleDropdownDisplay(this.monthSelect);
    });

    this.monthDropdown
      ?.querySelectorAll('.ac-datepicker-header-select-option')
      .forEach((monthElement, index) => {
        monthElement.addEventListener('click', () => {
          this.month.value = index + 1;
          this.setupDatePicker();
          this.toggleDropdownDisplay(this.monthSelect);
        });
      });

    this.yearSelect?.addEventListener('click', () => {
      this.toggleDropdownDisplay(this.yearSelect);
    });

    this.yearDropdown
      ?.querySelectorAll('.ac-datepicker-header-select-option')
      .forEach((yearElement) => {
        yearElement.addEventListener('click', () => {
          this.year.value = parseInt(yearElement.textContent || '2024');
          this.setupDatePicker();
          this.toggleDropdownDisplay(this.yearSelect);
        });
      });

    this.updateDecadeDisplay();

    this.decadeLeftButton?.addEventListener('click', () => {
      if (this.startDecadeYear > this.year.min) {
        this.startDecadeYear -= 10;
        this.updateDecadeDisplay();
      }
    });

    this.decadeRightButton?.addEventListener('click', () => {
      if (this.startDecadeYear < this.year.max - 9) {
        this.startDecadeYear += 10;
        this.updateDecadeDisplay();
      }
    });
  }

  private updateDynamicModalPosition(): void {
    const triggerRect = this.wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    if (spaceAbove > spaceBelow) {
      this.datePicker.classList.add('position-above');
    } else {
      this.datePicker.classList.remove('position-above');
    }
  }

  public openModal(): void {
    this.updateDynamicModalPosition();

    this.updateModal();
    this.wrapper.classList.add('active');

    if (this.startBool === false) {
      this.month.input.focus();
    }

    this.startBool = true;
  }

  public closeModal(validate: boolean = true): void {
    this.closeDropdownDisplay();
    this.wrapper.classList.remove('active');
    if (!this.year.inputValue && !this.month.inputValue && !this.day.inputValue) {
      this.startBool = false;
    }
    if (validate) {
      this.validate();
    }
  }

  public updateModal(): void {
    this.startDecadeYear = this.year.value - (this.year.value % 10);
    this.updateDecadeDisplay();
    this.setupDatePicker();
  }

  public updateDate(year: number, month: number, day: number): void {
    this.year.value = year;
    this.month.value = month;
    this.day.value = day;

    this.startDecadeYear = this.year.value - (this.year.value % 10);

    this.closeModal();
  }

  // Validation
  public validate(): boolean {
    const year = parseInt(this.year.input.value);
    const month = parseInt(this.month.input.value);
    const day = parseInt(this.day.input.value);
    const feedbackElement = this.parent.querySelector('.ac-feedback');
    let message = 'Invalid date';

    let isValid = true;

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      isValid = false;
    }

    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      isValid = false;
    }

    if (
      this.required &&
      (!this.year.input.value || !this.month.input.value || !this.day.input.value)
    ) {
      isValid = false;
      message = 'This is required';
    }

    if (feedbackElement) {
      if (!isValid) {
        feedbackElement.textContent = message;
      } else {
        feedbackElement.textContent = 'Great!';
      }
    }

    if (!isValid) {
      this.wrapper.classList.add('invalid');
      this.wrapper.classList.remove('valid');
      if (this.year.input) this.year.input.setCustomValidity('Invalid date');
      if (this.month.input) this.month.input.setCustomValidity('Invalid date');
      if (this.day.input) this.day.input.setCustomValidity('Invalid date');
    } else {
      this.wrapper.classList.remove('invalid');
      this.wrapper.classList.add('valid');
      if (this.year.input) this.year.input.setCustomValidity('');
      if (this.month.input) this.month.input.setCustomValidity('');
      if (this.day.input) this.day.input.setCustomValidity('');
    }

    return isValid;
  }

  validateYear(value: number, errorHandle: boolean | null): boolean | null {
    if (
      this.year.length === 2 &&
      value !== 19 &&
      value !== 20 &&
      value >= 0 &&
      value <= this.year.max - 2000
    ) {
      if (value < 10) {
        this.year.value = parseInt('200' + value);
      } else {
        this.year.value = parseInt('20' + value);
      }
      return false;
    }
    if (this.year.length === 2 && value !== 19 && value !== 20) {
      this.year.value = parseInt('19' + value);
      return false;
    }

    if (this.year.length === 4 && value >= this.year.min && value <= this.year.max) {
      return true;
    }
    if (errorHandle === false || !errorHandle) {
      return null;
    }
    return false;
  }

  validateMonth(value: number, errorHandle: boolean | null): boolean | null {
    if (value >= 2 && value <= 12) {
      return true;
    }
    if (value === 1 && errorHandle === true) {
      return true;
    }
    if (value === 1 && errorHandle === false) {
      return null;
    }
    return false;
  }
  validateDay(value: number, errorHandle: boolean | null): boolean | null {
    this.day.max = new Date(this.year.value, this.month.value, 0).getDate();
    this.day.min = 4;
    if (this.month.value === 2) {
      this.day.max = 29;
      this.day.min = 3;
    }

    if (value >= this.day.min && value <= this.day.max) {
      return true;
    }
    if (value >= 1 && value <= this.day.max && errorHandle === true) {
      return true;
    }
    if (value >= 1 && value <= this.day.max && errorHandle === false) {
      return null;
    }
    return false;
  }

  private toggleDropdownDisplay(currentSelectElement: Element): void {
    this.allSelectElements.forEach((selectElement) => {
      if (selectElement !== currentSelectElement) {
        selectElement.classList.remove('active');
      }
    });
    currentSelectElement.classList.toggle('active');
  }

  private closeDropdownDisplay(): void {
    this.allSelectElements.forEach((selectElement) => {
      selectElement.classList.remove('active');
    });
  }

  private updateDecadeDisplay = () => {
    this.startDecadeYear = Math.max(
      this.year.min,
      Math.min(this.startDecadeYear, this.year.max - 9)
    );
    this.decadeDisplay.textContent = `${this.startDecadeYear} - ${Math.min(
      this.startDecadeYear + 9,
      this.year.max
    )}`;
    this.yearOptions.innerHTML = '';
    for (
      let year = this.startDecadeYear;
      year <= Math.min(this.startDecadeYear + 9, this.year.max);
      year++
    ) {
      const yearElement = document.createElement('div');
      yearElement.classList.add('ac-datepicker-header-select-option');
      yearElement.textContent = `${year}`;
      yearElement.addEventListener('click', () => {
        this.year.value = parseInt(yearElement.textContent || '2024');
        this.setupDatePicker();
        this.toggleDropdownDisplay(this.yearSelect);
      });
      this.yearOptions.appendChild(yearElement);
    }
    this.updateButtonStates();
  };

  private updateButtonStates(): void {
    if (this.decadeLeftButton) {
      this.decadeLeftButton.classList.toggle('disabled', this.startDecadeYear <= this.year.min);
    }
    if (this.decadeRightButton) {
      this.decadeRightButton.classList.toggle(
        'disabled',
        this.startDecadeYear >= this.year.max - 9
      );
    }
  }

  public getDate(format: string = 'YYYY-MM-DD'): string {
    const year = parseInt(this.year.input.value);
    const month = parseInt(this.month.input.value);
    const day = parseInt(this.day.input.value);

    const date = new Date(year, month - 1, day); // Month is zero-based

    const zeroPad = (num: number) => num.toString().padStart(2, '0');
    const formattedDate = format
      .replace('YYYY', year.toString())
      .replace('MM', zeroPad(month))
      .replace('DD', zeroPad(day));

    return formattedDate;
  }

  public getValue() {
    const newJson = {
      question_id: this.parent.id,
      answer: this.getDate(),
    };

    return newJson;
  }
}

export { DateInputHandler };
