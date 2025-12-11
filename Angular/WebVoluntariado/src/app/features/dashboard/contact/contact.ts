import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../activity-modal/activity-modal';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent, FooterComponent, NavbarComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  allActivities: any[] = [];
  upcomingActivities: any[] = [];
  entities: any[] = [];
  selectedActivity: any = null;
  isModalOpen = false;

  // Datos de actividades pasadas del usuario
  pastActivitiesByUser: { [userId: number]: any[] } = {
    1: [
      { name: 'Actividad de jardin', type: 'Jardineria', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-10-15', rating: 5 },
      { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 5, image: '', entity: 'Amabir', date: '2024-09-20', rating: 4 }
    ],
    2: [
      { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 5, image: '', entity: 'Solera Asistencial', date: '2024-09-12', rating: 4 },
      { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 10, image: '', entity: 'Cuatrovientos', date: '2024-08-05', rating: 5 }
    ],
    3: [
      { name: 'Gestion de actividades', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Amabir', date: '2024-10-01', rating: 5 }
    ],
    4: [
      { name: 'Supervision general', type: 'Administrativo', slots: 0, filled: 0, image: '', entity: 'Cuatrovientos', date: '2024-10-10', rating: 5 }
    ]
  };

  // Todas las actividades disponibles ordenadas cronologicamente
  allAvailableActivities = [
    { name: 'Actividad de jardin', type: 'Jardineria', slots: 5, filled: 1, image: '', entity: 'Amabir', date: '2024-12-15' },
    { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 3, image: '', entity: 'Amabir', date: '2024-12-20' },
    { name: 'Paseo acompanado', type: 'Acompanamiento', slots: 5, filled: 0, image: '', entity: 'Amabir', date: '2024-12-25' },
    { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 2, image: '', entity: 'Amabir', date: '2025-01-10' },
    { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 1, image: '', entity: 'Solera Asistencial', date: '2025-01-15' },
    { name: 'Compania en residencia', type: 'Acompanamiento', slots: 5, filled: 4, image: '', entity: 'Solera Asistencial', date: '2025-01-20' },
    { name: 'Apoyo administrativo', type: 'Administrativo', slots: 5, filled: 2, image: '', entity: 'Solera Asistencial', date: '2025-02-05' },
    { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 2, image: '', entity: 'Cuatrovientos', date: '2025-02-10' },
    { name: 'Taller de tecnologia', type: 'Tecnologia', slots: 8, filled: 5, image: '', entity: 'Cuatrovientos', date: '2025-02-15' },
    { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 7, image: '', entity: 'Cuatrovientos', date: '2025-03-01' }
  ];

  // Entidades disponibles
  entitiesList = [
    { name: 'Amabir', type: 'Organizacion', image: '' },
    { name: 'Solera Asistencial', type: 'Organizacion', image: '' },
    { name: 'Cuatrovientos', type: 'Organizacion', image: '' }
  ];

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar actividades pasadas del usuario
    const userPastActivities = this.pastActivitiesByUser[this.currentUser.id] || [];
    this.allActivities = userPastActivities.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Cargar actividades proximas ordenadas cronologicamente (de mas cercana a mas lejana)
    this.upcomingActivities = this.allAvailableActivities
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Cargar entidades sin orden especifico
    this.entities = this.entitiesList;
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
    console.log('Participar:', this.selectedActivity.name);
    this.closeActivityModal();
  }
}
