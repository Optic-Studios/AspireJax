import { generateValidationMessage } from './validation-message';

class SelectInputHandler {
  private parent: HTMLElement;
  private input: HTMLSelectElement;
  private required: boolean;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.input = this.parent.getElementsByTagName('select')[0] as HTMLSelectElement;
    this.required = this.input?.hasAttribute('required') || false;
    this.init();
    this.setupGlobalClickListener();
  }
  private init() {
    this.parent.classList.add('inactive');
    this.createCustomDropdown();
  }
  private createCustomDropdown(): void {
    const selectedItem = document.createElement('div');
    selectedItem.setAttribute('class', 'select-selected');
    selectedItem.innerHTML = this.input.options[this.input.selectedIndex].innerHTML;
    this.parent.appendChild(selectedItem);

    const optionList = document.createElement('div');
    optionList.setAttribute('class', 'select-items select-hide');
    let clearOptionShown = false;

    for (let j = 1; j < this.input.length; j++) {
      const option = document.createElement('div');
      option.classList.add('select-option');
      option.innerHTML = this.input.options[j].innerHTML;
      option.addEventListener('click', (e) => {
        this.onOptionClick(e, option);
        this.validate();

        if (clearOptionShown === false) {
          const clearOption = document.createElement('div');
          clearOption.innerHTML =
            '<div class="select-clear"><svg class="ac-select-clear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"/></svg>Clear Selection</div>';
          clearOption.addEventListener('click', (e) => {
            this.clearSelect(e);
            clearOption.remove();
            clearOptionShown = false;
            this.validate();
          });
          clearOptionShown = true;
          optionList.appendChild(clearOption);
        }
      });
      optionList.appendChild(option);
    }

    this.parent.appendChild(optionList);

    selectedItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeAllSelect(selectedItem);
      optionList.classList.toggle('select-hide');
      selectedItem.classList.toggle('select-arrow-active');
      this.parent.classList.toggle('active');
      this.parent.classList.remove('inactive');
      if (!this.parent.classList.contains('active')) {
        this.parent.classList.add('inactive');
      }
    });
  }

  private onOptionClick(event: MouseEvent, option: Element): void {
    for (let i = 0; i < this.input.length; i++) {
      if (this.input.options[i].innerHTML === option.innerHTML) {
        this.input.selectedIndex = i;
        (event.currentTarget as Element).parentElement!.previousSibling!.textContent =
          option.innerHTML;
        const previouslySelected = this.parent.getElementsByClassName('same-as-selected');
        while (previouslySelected.length) {
          previouslySelected[0].classList.remove('same-as-selected');
        }
        option.classList.add('same-as-selected');
        this.parent.classList.add('answered');

        break;
      }
    }
    (event.currentTarget as Element).parentElement!.previousSibling!.dispatchEvent(
      new Event('click')
    );
  }

  private clearSelect(event: MouseEvent): void {
    this.input.selectedIndex = -1;
    (event.currentTarget as Element).parentElement!.previousSibling!.textContent = '';
    const previouslySelected = this.parent.getElementsByClassName('same-as-selected');
    while (previouslySelected.length) {
      previouslySelected[0].classList.remove('same-as-selected');
    }
    this.parent.classList.remove('answered');
  }

  private closeAllSelect(exceptThis: Element | null): void {
    const allSelectItems = document.getElementsByClassName('select-items');
    const allSelectedItems = document.getElementsByClassName('select-selected');

    for (let i = 0; i < allSelectedItems.length; i++) {
      const selectedItem = allSelectedItems[i];
      const optionList = allSelectItems[i];

      if (selectedItem !== exceptThis) {
        selectedItem.classList.remove('select-arrow-active');
      }

      if (optionList && optionList !== exceptThis?.nextSibling && optionList.parentNode) {
        optionList.classList.add('select-hide');
        this.parent.classList.add('inactive');
        this.parent.classList.remove('active');
      }
    }

    document.dispatchEvent(new CustomEvent('closeAllModals'));
  }

  private setupGlobalClickListener(): void {
    document.addEventListener('click', () => this.closeAllSelect(null));
  }

  private findNextSiblingWithClass(element: Element, className: string) {
    let sibling = element.nextElementSibling;
    while (sibling) {
      if (sibling.classList.contains(className)) {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }
    return null;
  }

  public validate() {
    let isValid = true;
    const feedbackElement = this.findNextSiblingWithClass(this.parent, 'ac-feedback');
    const selectionValue = this.parent.querySelector('.select-selected')?.textContent;
    let message = 'Invalid Input';

    if (this.required && !this.input.value) {
      isValid = false;
      message = 'This is required';
    }

    if (feedbackElement) {
      if (!isValid) {
        feedbackElement.textContent = message;
      } else {
        if (selectionValue === 'Widowed') {
          feedbackElement.textContent = '';
        } else if (selectionValue === 'Seperated') {
          feedbackElement.textContent = '';
        } else if (selectionValue === 'Married') {
          feedbackElement.textContent = '';
        } else if (selectionValue === 'Divorced') {
          feedbackElement.textContent = '';
        } else if (selectionValue === 'Single') {
          feedbackElement.textContent = '';
        } else if (selectionValue === 'Male') {
          feedbackElement.textContent = 'He/Him';
        } else if (selectionValue === 'Female') {
          feedbackElement.textContent = 'She/Her';
        } else if (selectionValue === '') {
          feedbackElement.textContent = '';
        } else {
          feedbackElement.textContent = generateValidationMessage();
        }
      }
    }

    if (!isValid) {
      this.parent.classList.add('invalid');
      this.parent.classList.remove('valid');
    } else if (isValid && this.input.value !== '') {
      this.parent.classList.remove('invalid');
      this.parent.classList.add('valid');
    } else {
      this.parent.classList.remove('invalid');
      this.parent.classList.remove('valid');
    }

    return isValid;
  }

  public getValue() {
    if (this.input === null) return false;

    const newJson = {
      question_id: this.parent.id,
      answer: this.input.value.toString(),
    };

    return newJson;
  }
}

export { SelectInputHandler };
