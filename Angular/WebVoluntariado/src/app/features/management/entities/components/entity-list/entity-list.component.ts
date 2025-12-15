import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entity } from '../../../../../services/entities.service';

@Component({
    selector: 'app-entity-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded shadow-sm">
      <div class="list-group list-group-flush">
        <!-- Header Row -->
        <div class="list-group-item bg-transparent fw-bold d-flex align-items-center py-3 border-bottom-2">
          <div class="col-4">Nombre Entidad</div>
          <div class="col-3">Fecha de Inscripción</div>
          <div class="col-3">Responsable</div>
          <div class="col-2 text-end"></div>
        </div>

        <!-- Items -->
        @for (ent of entities; track ent.id) {
          <div 
            class="list-group-item action-item d-flex align-items-center py-3 border-bottom pointer"
            [class.bg-light]="selectedId === ent.id"
            (click)="onSelect(ent)">
            
            <div class="col-4 fw-medium">{{ ent.name }}</div>
            <div class="col-3 text-muted">{{ ent.registrationDate | date:'dd/MM/yyyy' }}</div>
            <div class="col-3 text-muted">{{ ent.responsible }}</div>
            <div class="col-2 text-end">
              <button class="btn btn-sm btn-primary rounded-pill px-3" style="background-color: #0d47a1; border: none;">
                Contacto
              </button>
            </div>
          </div>
        } @empty {
          <div class="list-group-item py-4 text-center text-muted">
            No hay entidades para mostrar.
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
export class EntityListComponent {
    @Input() entities: Entity[] = [];
    @Input() selectedId: number | null = null;
    @Output() select = new EventEmitter<Entity>();

    onSelect(entity: Entity) {
        this.select.emit(entity);
    }
}
