import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterSection {
  key: string;
  label: string;
  type: 'radio' | 'checkbox';
  options: FilterOption[];
}

@Component({
  selector: 'app-filter-sort',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-relative">
      <div class="d-flex gap-4 align-items-center">
        <!-- Unified Filter Dropdown -->
        @if (filterSections.length > 0) {
        <div class="dropdown">
          <button class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
            type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style="font-size: 1.1rem;">
            <i class="bi bi-funnel"></i>
            @if (hasActiveFilters()) {
              Filtrar: <span class="fw-bold">Activo</span>
            } @else {
              Filtrar
            }
            <i class="bi bi-chevron-down ms-1" style="font-size: 0.8em;"></i>
          </button>
          <div class="dropdown-menu p-3 shadow-sm border-0" style="min-width: 300px; max-height: 500px; overflow-y: auto;">
            @for (section of filterSections; track section.key; let last = $last) {
              <h6 class="dropdown-header px-0 text-uppercase small fw-bold text-muted mb-2">{{ section.label }}</h6>
              <div class="mb-3">
                @for (option of section.options; track option.value) {
                  <div class="form-check mb-1">
                    @if (section.type === 'radio') {
                      <input class="form-check-input" type="radio" [name]="section.key" [id]="section.key + '-' + option.value"
                        [value]="option.value" [checked]="activeFilters[section.key] === option.value"
                        (change)="onRadioChange(section.key, option.value)">
                    } @else {
                      <input class="form-check-input" type="checkbox" [id]="section.key + '-' + option.value"
                        [value]="option.value" [checked]="isChecked(section.key, option.value)"
                        (change)="onCheckboxChange(section.key, option.value)">
                    }
                    <label class="form-check-label" [for]="section.key + '-' + option.value">
                      {{ option.label }}
                    </label>
                  </div>
                }
              </div>
              @if (!last) {
                <hr class="dropdown-divider my-3">
              }
            }
          </div>
        </div>
        }
  
        <!-- Group By -->
        @if (groupOptions.length > 0) {
        <div class="dropdown">
          <button class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
            type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.1rem;">
            <i class="bi bi-grid"></i> 
            @if (getLabel(groupOptions, currentGroup)) {
              Agrupar: <span class="fw-bold">{{ getLabel(groupOptions, currentGroup) }}</span>
            } @else {
              Agrupar por
            }
            <i class="bi bi-chevron-down ms-1" style="font-size: 0.8em;"></i>
          </button>
          <ul class="dropdown-menu">
            @for (option of groupOptions; track option.value) {
              <li><a class="dropdown-item" [class.active]="option.value === currentGroup" href="javascript:void(0)" (click)="onGroupChange(option.value)">{{ option.label }}</a></li>
            }
          </ul>
        </div>
        }
  
        <!-- Sort By -->
        @if (sortOptions.length > 0) {
        <div class="dropdown">
          <button class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
            type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 1.1rem;">
            <i class="bi bi-filter-left"></i> 
            @if (getLabel(sortOptions, currentSort)) {
              Ordenar: <span class="fw-bold">{{ getLabel(sortOptions, currentSort) }}</span>
            } @else {
              Ordenar por
            }
            <i class="bi bi-chevron-down ms-1" style="font-size: 0.8em;"></i>
          </button>
          <ul class="dropdown-menu">
            @for (option of sortOptions; track option.value) {
              <li><a class="dropdown-item" [class.active]="option.value === currentSort" href="javascript:void(0)" (click)="onSortChange(option.value)">{{ option.label }}</a></li>
            }
          </ul>
        </div>
        }
      </div>
  
      <!-- Active Filters Chips -->
      @if (hasActiveFilters()) {
      <div class="d-flex flex-wrap gap-2 position-absolute end-0 mt-2 align-items-center" style="top: 100%; min-width: 300px; justify-content: flex-end; z-index: 100;">
        <span class="text-muted small fw-bold me-2">Filtros activos:</span>
        
        @for (section of filterSections; track section.key) {
          @if (section.type === 'radio' && activeFilters[section.key] && activeFilters[section.key] !== 'all') {
            <span class="badge bg-white border text-dark d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm">
              {{ section.label }}: {{ getOptionLabel(section, activeFilters[section.key]) }}
              <i class="bi bi-x cursor-pointer text-muted hover-danger" (click)="onRadioChange(section.key, 'all')"></i>
            </span>
          } @else if (section.type === 'checkbox' && activeFilters[section.key]?.length > 0) {
            @for (val of activeFilters[section.key]; track val) {
              <span class="badge bg-white border text-dark d-flex align-items-center gap-2 py-2 px-3 rounded-pill shadow-sm">
                {{ getOptionLabel(section, val) }}
                <i class="bi bi-x cursor-pointer text-muted hover-danger" (click)="onCheckboxChange(section.key, val)"></i>
              </span>
            }
          }
        }
  
        <button class="btn btn-link btn-sm text-danger text-decoration-none fw-bold bg-white rounded-pill px-2" (click)="clearAllFilters()">
          Borrar todo
        </button>
      </div>
      }
    </div>
  `,
  styles: [`
    .hover-danger:hover { color: #dc3545 !important; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class FilterSortComponent {
  @Input() filterSections: FilterSection[] = [];
  @Input() groupOptions: { label: string, value: string }[] = [];
  @Input() sortOptions: { label: string, value: string }[] = [];

  @Input() activeFilters: { [key: string]: any } = {};
  @Input() currentGroup: string = '';
  @Input() currentSort: string = '';

  @Output() activeFiltersChange = new EventEmitter<{ [key: string]: any }>();
  @Output() groupChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  
  @Input() filterOptions: { label: string, value: string }[] = [];
  @Input() currentFilter: string = '';
  @Output() filterChange = new EventEmitter<string>();

  onRadioChange(key: string, value: any) {
    const newFilters = { ...this.activeFilters, [key]: value };
    this.activeFiltersChange.emit(newFilters);

    
    if (key === 'status' || this.filterOptions.length > 0) {
      this.filterChange.emit(value);
    }
  }

  onCheckboxChange(key: string, value: any) {
    const currentValues = this.activeFilters[key] || [];
    let newValues;
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v: any) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    const newFilters = { ...this.activeFilters, [key]: newValues };
    this.activeFiltersChange.emit(newFilters);
  }

  isChecked(key: string, value: any): boolean {
    return this.activeFilters[key]?.includes(value);
  }

  hasActiveFilters(): boolean {
    return this.filterSections.some(section => {
      if (section.type === 'radio') {
        return this.activeFilters[section.key] && this.activeFilters[section.key] !== 'all';
      } else {
        return this.activeFilters[section.key]?.length > 0;
      }
    });
  }

  clearAllFilters() {
    const newFilters: { [key: string]: any } = {};
    this.filterSections.forEach(section => {
      if (section.type === 'radio') {
        newFilters[section.key] = 'all';
      } else {
        newFilters[section.key] = [];
      }
    });
    this.activeFiltersChange.emit(newFilters);
    this.filterChange.emit('all'); 
  }

  getOptionLabel(section: FilterSection, value: any): string {
    return section.options.find(o => o.value === value)?.label || 'Desconocido';
  }

  onGroupChange(value: string) {
    this.groupChange.emit(value);
  }

  onSortChange(value: string) {
    this.sortChange.emit(value);
  }

  getLabel(options: { label: string, value: string }[], value: string): string | null {
    if (!value || value === 'all' || value === '') return null;
    const option = options.find(o => o.value === value);
    return option ? option.label : null;
  }
}
