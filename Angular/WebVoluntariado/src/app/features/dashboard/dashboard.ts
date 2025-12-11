import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModalComponent } from './activity-modal/activity-modal';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { AppCarrouselComponent } from '../../shared/components/app-carrousel/app-carrousel';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  selectedActivity: any = null;
  isModalOpen = false;

  entitiesActivities = [
    {
      entity: 'Amabir',
      activities: [
        { name: 'Actividad de jardín', type: 'Jardinería', slots: 5, filled: 1, image: '' },
        { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 3, image: '' },
        { name: 'Paseo acompañado', type: 'Acompañamiento', slots: 5, filled: 0, image: '' },
        { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 2, image: '' }
      ]
    },
    {
      entity: 'Solera Asistencial',
      activities: [
        { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 1, image: '' },
        { name: 'Compañía en residencia', type: 'Acompañamiento', slots: 5, filled: 4, image: '' },
        { name: 'Apoyo administrativo', type: 'Administrativo', slots: 5, filled: 2, image: '' }
      ]
    }
  ];

  proposals = [
    { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 2, image: '', customBackground: '#fff', showIcon: true },
    { name: 'Taller de tecnología', type: 'Tecnología', slots: 8, filled: 5, image: '', customBackground: '#fff', showIcon: true },
    { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 7, image: '', customBackground: '#fff', showIcon: true }
  ];

  otherEntities = [
    { name: 'Cáritas Diocesana', type: 'ONG Social', slots: 0, filled: 0, image: 'assets/caritas.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
    { name: 'Cruz Roja', type: 'Organización Humanitaria', slots: 0, filled: 0, image: 'assets/cruzroja.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
    { name: 'Fundación Española', type: 'Fundación', slots: 0, filled: 0, image: 'assets/fundacion.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' }
  ];

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
    }
  }



  scrollCarousel(event: Event, direction: 'left' | 'right') {
    event.preventDefault();

    const track = (event.target as HTMLElement)
      .closest('.d-flex')
      ?.querySelector('.carousel-track') as HTMLElement;

    if (track) {
      const cardWidth = track.clientWidth / 3; // EXACTAMENTE 3 TARJETAS VISIBLES
      track.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  }

  openActivityModal(activity: any) {
    this.selectedActivity = {
      ...activity,
      location: activity.location || 'Polideportivo Municipal',
      time: activity.time || '10:00',
      description: activity.description || 'Descripción breve de tareas de la actividad'
    };
    this.isModalOpen = true;
  }

  closeActivityModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  onActivityAction() {
    // Aquí irá la lógica de participar
    console.log('Participar en:', this.selectedActivity.name);
    this.closeActivityModal();
  }

  get navbarOptions(): NavbarOption[] {
    return [
      { label: 'Mis actividades pasadas', path: '/past-activities' },
      { label: 'Contacto', path: '#' },
      { label: 'Nuevas actividades', type: 'button', path: '/dashboard' }
    ];
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
