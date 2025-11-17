class sliderInput {
  public id: string;
  public wrapper: HTMLElement;
  public input: HTMLInputElement | null;
  private _value: string | number;
  private values: Record<string, string>;
  private nodes: NodeListOf<HTMLElement>;

  constructor(wrapper: HTMLElement, values: Record<string, string>) {
    this._value = 0;
    this.wrapper = wrapper;
    this.id = wrapper.id;
    this.input = wrapper.querySelector('input') || null;
    this.nodes = this.wrapper.querySelectorAll('.ac-slider-node.node-default');
    this.values = values;
    this.value = 0;
    this.init();
  }

  get value(): string | number {
    if (this._value in this.values) {
      return this.values[this._value];
    }
    console.error('Key not found or invalid value for conversion to number.');
    return this.values[this._value];
  }

  set value(newValue: string | number) {
    this._value = newValue;
    this.nodes.forEach((node: HTMLElement, index) => {
      if (index < Number(newValue)) {
        node.classList.remove('node-default');
        node.classList.remove('node-true');
        node.classList.add('node-active');
      } else if (index === Number(newValue)) {
        node.classList.remove('node-default');
        node.classList.add('node-active');
        node.classList.add('node-true');
      } else {
        node.classList.remove('node-active');
        node.classList.remove('node-true');
        node.classList.add('node-default');
      }
    });

    let percentage = '0';

    if (Number(newValue) > 0) {
      percentage = ((Number(newValue) / Number(this.input?.max)) * 100).toString();
    }
    const background = this.wrapper.querySelector('.ac-slider-background') as HTMLElement;
    const outline = this.wrapper.querySelector('.ac-slider-outline') as HTMLElement;
    background.style.backgroundImage = `linear-gradient(to right, var(--color-primary) ${percentage}%, #ffffff ${percentage}%)`;
    outline.style.backgroundImage = `linear-gradient(to right, var(--color-primary) ${percentage}%, var(--color-outline) ${percentage}%)`;
  }

  private init() {
    if (this.input !== null) {
      this.input.value = '0';
      this.input.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
      });
      this.input.addEventListener('click', (event) => {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
      });
    }
  }
}

export { sliderInput };
