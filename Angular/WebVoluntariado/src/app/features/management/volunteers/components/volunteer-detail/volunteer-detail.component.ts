import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Volunteer } from '../../../../../services/volunteers.service';

@Component({
    selector: 'app-volunteer-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (volunteer) {
      <div class="card border-0 shadow-sm p-3" style="background-color: #f8f9fa;">
        <img [src]="volunteer.image" class="card-img-top rounded mb-3" alt="Avatar"
          style="height: 300px; object-fit: cover;">
        <div class="card-body p-0">
          <h4 class="fw-bold mb-1">{{ volunteer.name }}</h4>
          
          <div class="d-flex justify-content-between text-muted small mb-3">
            <div>
              <span>Fecha de nacimiento</span><br>
              <span class="fw-bold text-dark">{{ volunteer.birthDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="text-end">
              <span>Grupo</span><br>
              <span class="fw-bold text-dark">{{ volunteer.group }}</span>
            </div>
          </div>
            <div class="d-flex justify-content-between text-muted small mb-3">
            <div class="text-end">
              <span>Curso actual</span><br>
              <span class="fw-bold text-dark">{{ volunteer.course }}</span>
            </div>
          </div>

          <div class="mb-4">
            <span class="fw-bold small d-block mb-2">Intereses</span>
            <ul class="list-unstyled">
              @for (interest of volunteer.interests; track interest) {
                <li>• {{ interest }}</li>
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
export class VolunteerDetailComponent {
    @Input() volunteer: Volunteer | null = null;
}
