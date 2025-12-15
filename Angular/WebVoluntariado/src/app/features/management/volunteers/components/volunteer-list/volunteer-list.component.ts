import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Volunteer } from '../../../../../services/volunteers.service';

@Component({
    selector: 'app-volunteer-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded shadow-sm">
      <div class="list-group list-group-flush">
        <!-- Header Row -->
        <div class="list-group-item bg-transparent fw-bold d-flex align-items-center py-3 border-bottom-2">
          <div class="col-4">Nombre voluntario</div>
          <div class="col-3">Fecha de nacimiento</div>
          <div class="col-3">Grupo</div>
          <div class="col-2 text-end"></div>
        </div>

        <!-- Items -->
        @for (vol of volunteers; track vol.id) {
          <div 
            class="list-group-item action-item d-flex align-items-center py-3 border-bottom pointer"
            [class.bg-light]="selectedId === vol.id"
            (click)="onSelect(vol)">
            
            <div class="col-4 fw-medium">{{ vol.name }}</div>
            <div class="col-3 text-muted">{{ vol.birthDate | date:'dd/MM/yyyy' }}</div>
            <div class="col-3 text-muted">{{ vol.group }}</div>
            <div class="col-2 text-end">
              <button class="btn btn-sm btn-primary rounded-pill px-3" style="background-color: #0d47a1; border: none;">
                Contacto
              </button>
            </div>
          </div>
        } @empty {
          <div class="list-group-item py-4 text-center text-muted">
            No hay voluntarios para mostrar.
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .action-item:hover { background-color: #f1f3f5; cursor: pointer; }
    .border-bottom-2 { border-bottom: 2px solid #000 !important; }
  `]
})
export class VolunteerListComponent {
    @Input() volunteers: Volunteer[] = [];
    @Input() selectedId: number | null = null;
    @Output() select = new EventEmitter<Volunteer>();

    onSelect(volunteer: Volunteer) {
        this.select.emit(volunteer);
    }
}
