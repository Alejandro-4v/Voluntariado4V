import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-filter-sort',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="d-flex gap-4">
      <!-- Group By -->
      <div class="dropdown">
        <button class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
          type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.1rem;">
          <i class="bi bi-grid"></i> Agrupar por
        </button>
        <ul class="dropdown-menu">
          @for (option of groupOptions; track option.value) {
            <li><a class="dropdown-item" href="javascript:void(0)" (click)="onGroupChange(option.value)">{{ option.label }}</a></li>
          }
        </ul>
      </div>

      <!-- Sort By -->
      <div class="dropdown">
        <button class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
          type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.1rem;">
          <i class="bi bi-filter-left"></i> Ordenar por
        </button>
        <ul class="dropdown-menu">
          @for (option of sortOptions; track option.value) {
            <li><a class="dropdown-item" href="javascript:void(0)" (click)="onSortChange(option.value)">{{ option.label }}</a></li>
          }
        </ul>
      </div>
    </div>
  `,
    styles: []
})
export class FilterSortComponent {
    @Input() groupOptions: { label: string, value: string }[] = [];
    @Input() sortOptions: { label: string, value: string }[] = [];

    @Output() groupChange = new EventEmitter<string>();
    @Output() sortChange = new EventEmitter<string>();

    onGroupChange(value: string) {
        this.groupChange.emit(value);
    }

    onSortChange(value: string) {
        this.sortChange.emit(value);
    }
}
