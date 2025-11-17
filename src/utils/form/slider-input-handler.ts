import { sliderInput } from './inputs/sliderInput';

class SliderInputHandler {
  private parent: HTMLElement;
  private values: Record<string, string>;
  private sliderInputs: sliderInput[];

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.values = {};
    Array.from(parent.attributes).forEach((attr) => {
      if (attr.name.startsWith('value-')) {
        const key = attr.name.split('-')[1];
        this.values[key] = attr.value;
        parent.removeAttribute(attr.name);
      }
    });
    this.sliderInputs = [];
    const _sliderInputs = this.parent.querySelectorAll('[ac-slider-element="slider-option"]');
    _sliderInputs.forEach((input: Element) => {
      this.sliderInputs.push(new sliderInput(input as HTMLElement, this.values));
    });
  }

  public validate() {
    this.sliderInputs.forEach((input) => {
      if (input.value in this.values) {
        console.error(input, 'The value for this element is not valid');
        return false;
      }
    });

    return true;
  }

  public getValue() {
    const newJson = {
      question_id: this.parent.id,
      answer: [],
    };

    this.sliderInputs.forEach((input) => {
      const choice_id = input.id.toString();
      const scale_id = input.value.toString();
      newJson.answer.push({ choice_id, scale_id });
    });

    return newJson;
  }
}

export { SliderInputHandler };
