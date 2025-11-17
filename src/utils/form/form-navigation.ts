type Header = {
  element: HTMLElement;
  page: number;
};

export class FormNavigator {
  private currentPage: number;
  private headers: Header[];
  private totalPages: number;
  private backBtn: HTMLElement;
  private nextBtn: HTMLElement;
  private submitBtn: HTMLElement;

  constructor(
    headers: NodeListOf<Element>,
    backBtn: HTMLElement,
    nextBtn: HTMLElement,
    submitBtn: HTMLElement
  ) {
    this.currentPage = 1;
    this.headers = Array.from(headers).map((header) => ({
      element: header as HTMLElement,
      page: parseInt(header.getAttribute('form-page') ?? '0'),
    }));
    this.totalPages = this.calculateTotalPages();
    this.backBtn = backBtn;
    this.nextBtn = nextBtn;
    this.submitBtn = submitBtn;

    this.initializeNavigation();
  }

  private calculateTotalPages(): number {
    const pages = Array.from(document.querySelectorAll('[form-page]')).map((page) =>
      parseInt(page.getAttribute('form-page') ?? '0')
    );
    return Math.max(...pages);
  }

  private updateHeaderDisplay(): void {
    const relevantHeader = this.headers
      .slice()
      .reverse()
      .find((header) => header.page <= this.currentPage);

    if (relevantHeader) {
      this.headers.forEach((header) => {
        header.element.style.display = header === relevantHeader ? 'block' : 'none';
      });
    }
  }

  private showPage(pageNumber: number): void {
    document.querySelectorAll('[form-page]').forEach((pageElement) => {
      const page = pageElement as HTMLElement;
      page.style.display =
        parseInt(page.getAttribute('form-page') ?? '0') === pageNumber ? 'block' : 'none';
    });
    this.updateHeaderDisplay();
  }

  private updateButtonVisibility(): void {
    this.backBtn.style.display = this.currentPage === 1 ? 'none' : 'inline';
    this.nextBtn.style.display = this.currentPage === this.totalPages ? 'none' : 'inline';
    this.submitBtn.style.display = this.currentPage === this.totalPages ? 'inline' : 'none';
  }

  private initializeNavigation(): void {
    this.backBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.showPage(this.currentPage);
        this.updateButtonVisibility();
      }
    });

    this.nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.showPage(this.currentPage);
        this.updateButtonVisibility();
      }
    });

    this.showPage(this.currentPage);
    this.updateButtonVisibility();
  }
}
