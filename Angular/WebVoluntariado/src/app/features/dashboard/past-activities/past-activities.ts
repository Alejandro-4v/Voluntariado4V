import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AppCarrouselComponent } from '../app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../activity-modal/activity-modal';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-past-activities',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent, Navbar],
  templateUrl: 'past-activities.html',
  styleUrl: 'past-activities.scss'
})
export class PastActivitiesComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  allActivities: any[] = [];
  unratedActivities: any[] = [];
  selectedActivity: any = null;
  isModalOpen = false;

  pastActivitiesByUser: { [userId: number]: any[] } = {
    1: [
      { name: 'Actividad de jardin', type: 'Jardineria', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-10-15', rating: 5 },
      { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-09-20', rating: 4 },
      { name: 'Compania en residencia', type: 'Acompanamiento', slots: 5, filled: 5, image: '', entity: 'Solera Asistencial', date: '2024-08-10', rating: 5 },
      { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 12, image: '', entity: 'Cuatrovientos', date: '2024-07-22', rating: null },
      { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-06-18', rating: null }
    ],
    2: [
      { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 5, image: '', entity: 'Solera Asistencial', date: '2024-09-12', rating: 4 },
      { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 10, image: '', entity: 'Cuatrovientos', date: '2024-08-05', rating: 5 },
      { name: 'Taller de tecnologia', type: 'Tecnologia', slots: 8, filled: 8, image: '', entity: 'Cuatrovientos', date: '2024-07-15', rating: null }
    ],
    3: [
      { name: 'Gestion de actividades', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Amabir', date: '2024-10-01', rating: 5 },
      { name: 'Coordinacion de voluntarios', type: 'Coordinacion', slots: 0, filled: 0, image: '', entity: 'Amabir', date: '2024-09-01', rating: null }
    ],
    4: [
      { name: 'Supervision general', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-10-10', rating: 5 },
      { name: 'Generacion de reportes', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-09-25', rating: null },
      { name: 'Revision de actividades', type: 'Revision', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-08-30', rating: 5 }
    ]
  };

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const userActivities = this.pastActivitiesByUser[this.currentUser.id] || [];
    
    // Todas las actividades ordenadas de más reciente a más antigua
    this.allActivities = userActivities
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Solo las no valoradas
    this.unratedActivities = userActivities
      .filter((a: any) => a.rating === null || a.rating === undefined)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  openActivityModal(activity: any) {
    this.selectedActivity = {
      ...activity,
      location: activity.location || 'Polideportivo Municipal',
      time: activity.time || '10:00',
      description: activity.description || 'Descripcion breve de tareas de la actividad'
    };
    this.isModalOpen = true;
  }

  closeActivityModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  onActivityAction() {
    console.log('Valorar:', this.selectedActivity.name);
    this.closeActivityModal();
  }
}
