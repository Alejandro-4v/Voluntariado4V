import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entity } from '../../../../../services/entities.service';

@Component({
    selector: 'app-entity-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (entity) {
      <div class="card border-0 shadow-sm p-3" style="background-color: #f8f9fa;">
        <img [src]="entity.image" class="card-img-top rounded mb-3" alt="Logo"
          style="height: 300px; object-fit: cover;">
        <div class="card-body p-0">
          <h4 class="fw-bold mb-1">{{ entity.name }}</h4>
          
          <div class="d-flex justify-content-between text-muted small mb-3">
            <div>
              <span>Fecha de inscripción</span><br>
              <span class="fw-bold text-dark">{{ entity.registrationDate | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="mb-3">
            <span class="text-muted small">Responsable</span><br>
            <span class="fw-bold text-dark">{{ entity.responsible }}</span>
          </div>

          <div class="mb-4">
            <span class="fw-bold small d-block mb-2">Tipos de actividades</span>
            <ul class="list-unstyled">
              @for (type of entity.types; track type) {
                <li>• {{ type }}</li>
              }
            </ul>
          </div>

          <button class="btn btn-primary w-100 rounded-pill py-2" style="background-color: #0d47a1; border: none;">
            Contacto
          </button>
        </div>
      </div>
    }
  `,
    styles: [`
    .card { border-radius: 1rem; }
  `]
})
export class EntityDetailComponent {
    @Input() entity: Entity | null = null;
}
