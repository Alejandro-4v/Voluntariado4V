import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AppCarrouselComponent } from '../app-carrousel/app-carrousel';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-past-activities',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, Navbar],
  templateUrl: 'past-activities.html',
  styleUrl: 'past-activities.scss'
})
export class PastActivitiesComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  ratedActivities: any[] = [];
  unratedActivities: any[] = [];

  // Actividades pasadas por usuario
  pastActivitiesByUser: { [userId: number]: any[] } = {
    1: [ // Iryna Pavlenko
      { name: 'Actividad de jardín', type: 'Jardinería', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-10-15', rating: 5 },
      { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-09-20', rating: 4 },
      { name: 'Compañía en residencia', type: 'Acompañamiento', slots: 5, filled: 5, image: '', entity: 'Solera Asistencial', date: '2024-08-10', rating: 5 },
      { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 12, image: '', entity: 'Cuatrovientos', date: '2024-07-22', rating: null },
      { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-06-18', rating: null }
    ],
    2: [ // Juan García
      { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 5, image: '', entity: 'Solera Asistencial', date: '2024-09-12', rating: 4 },
      { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 10, image: '', entity: 'Cuatrovientos', date: '2024-08-05', rating: 5 },
      { name: 'Taller de tecnología', type: 'Tecnología', slots: 8, filled: 8, image: '', entity: 'Cuatrovientos', date: '2024-07-15', rating: null }
    ],
    3: [ // Amabir Organización
      { name: 'Gestión de actividades', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Amabir', date: '2024-10-01', rating: 5 },
      { name: 'Coordinación de voluntarios', type: 'Coordinación', slots: 0, filled: 0, image: '', entity: 'Amabir', date: '2024-09-01', rating: null }
    ],
    4: [ // Admin Cuatrovientos
      { name: 'Supervisión general', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-10-10', rating: 5 },
      { name: 'Generación de reportes', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-09-25', rating: null },
      { name: 'Revisión de actividades', type: 'Revisión', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-08-30', rating: 5 }
    ]
  };

  ngOnInit() {
  this.currentUser = this.authService.getCurrentUser();
  if (!this.currentUser) {
    this.router.navigate(['/login']);
    return;
  }

  const userActivities = this.pastActivitiesByUser[this.currentUser.id] || [];

  // Ordenar todas las actividades de más recientes a más antiguas
  userActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  this.ratedActivities = userActivities.filter(a => a.rating !== null && a.rating !== undefined);
  this.unratedActivities = userActivities.filter(a => a.rating === null || a.rating === undefined);
}

}
