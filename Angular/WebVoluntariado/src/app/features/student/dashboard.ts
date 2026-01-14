import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModalComponent } from '../../shared/components/activity-modal/activity-modal';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { AppCarrouselComponent } from '../../shared/components/app-carrousel/app-carrousel';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';
import { ActivitiesService } from '../../services/activities.service';
import { EntitiesService } from '../../services/entities.service';

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
  private activitiesService = inject(ActivitiesService);
  private entitiesService = inject(EntitiesService);

  currentUser: User | null = null;
  selectedActivity: any = null;
  isModalOpen = false;

  entitiesActivities: any[] = [];
  proposals: any[] = [];
  otherEntities: any[] = [];

  // Actividades pasadas por usuario
  // Actividades pasadas por usuario
  pastActivitiesByUser: { [userId: number]: any[] } = {};

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/iniciar-sesion']);
    }

    this.activitiesService.getAll().subscribe(data => {
      // Group by entity
      const grouped = data.reduce((acc, curr) => {
        const entityName = curr.convoca?.nombre || 'Desconocido';
        if (!acc[entityName]) {
          acc[entityName] = [];
        }
        acc[entityName].push(curr);
        return acc;
      }, {} as any);

      this.entitiesActivities = Object.keys(grouped).map(key => ({
        entity: key,
        activities: grouped[key]
      }));

      this.proposals = data.filter(a => a.estado === 'P'); // Pending as proposals
    });

    this.entitiesService.getAll().subscribe(data => {
      this.otherEntities = data;
    });
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
    this.router.navigate(['/auth/iniciar-sesion']);
  }
}
