import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appContentEditable]',
})
export class ContentEditableDirective {
  @Output() contentUpdated = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  @HostListener('dblclick')
  makeEditable() {
    const element = this.el.nativeElement as HTMLElement;
    element.setAttribute('contenteditable', 'true');
    element.focus();
  }

  @HostListener('focus')
  onFocus() {
    const element = this.el.nativeElement as HTMLElement;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  @HostListener('blur')
  onBlur() {
    this.finishEditing();
  }

  finishEditing() {
    const element = this.el.nativeElement as HTMLElement;
    element.removeAttribute('contenteditable');
    const cleaned = this.formatHtml(element.innerHTML);
    this.contentUpdated.emit(cleaned);
  }

  private formatHtml(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    return temp.innerHTML;
  }
}
