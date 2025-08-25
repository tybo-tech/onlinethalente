import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  ContentChild,
  TemplateRef,
  HostListener
} from '@angular/core';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
        (click)="onBackdropClick($event)"
      >
        <div
          class="w-[min(92vw,640px)] bg-white rounded-2xl shadow-xl"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="headerId"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 [id]="headerId" class="text-lg font-semibold text-gray-900">
              @if (headerTemplate) {
                <ng-container [ngTemplateOutlet]="headerTemplate" />
              } @else {
                {{ title }}
              }
            </h2>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <ng-content />
          </div>

          <!-- Footer -->
          @if (footerTemplate) {
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <ng-container [ngTemplateOutlet]="footerTemplate" />
            </div>
          }
        </div>
      </div>
    }
  `
})
export class UiModalComponent implements AfterViewInit {
  @Input() title = '';
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('footer') footerTemplate?: TemplateRef<any>;

  readonly headerId = `modal-${Math.random().toString(36).slice(2)}`;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.open) {
      this.focusFirstInput();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private close() {
    this.open = false;
    this.openChange.emit(false);
  }

  private focusFirstInput() {
    setTimeout(() => {
      const input = this.elementRef.nativeElement.querySelector(
        'input, select, textarea, button:not([disabled])'
      );
      if (input) {
        input.focus();
      }
    });
  }
}
