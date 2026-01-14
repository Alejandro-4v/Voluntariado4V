import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';

import { ActivitiesService } from '../../../services/activities.service';

@Component({
  selector: 'app-past-activities',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent],
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

  private activitiesService = inject(ActivitiesService);

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/iniciar-sesion']);
      return;
    }

    this.activitiesService.getAll().subscribe(activities => {
      const now = new Date();

      // Filter activities where user participated (by NIF) and are past (end date < now)
      const userActivities = activities.filter(a => {
        const isParticipant = a.voluntarios?.some(v => v.nif === this.currentUser?.nif);
        const isPast = new Date(a.fin) < now;
        return isParticipant && isPast;
      });

      // Sort by date descending
      this.allActivities = userActivities
        .sort((a, b) => new Date(b.fin).getTime() - new Date(a.fin).getTime());

      // Unrated activities (assuming logic for rating exists, for now just showing all as unrated or based on some other field if available)
      // Since API doesn't have 'rating' field in Actividad, we can't filter by it yet.
      // We'll just leave it empty or show all for now.
      this.unratedActivities = [];
    });
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
