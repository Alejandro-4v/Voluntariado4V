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

    this.activitiesService.getAll().subscribe(activities => {
      const now = new Date();

      
      const userActivities = activities.filter(a => {
        const isParticipant = a.voluntarios?.some(v => v.nif === this.currentUser?.nif);
        const isPast = new Date(a.fin) < now;
        return isParticipant && isPast;
      });

      
      this.allActivities = userActivities
        .sort((a, b) => new Date(b.fin).getTime() - new Date(a.fin).getTime());

      this.unratedActivities = [];
    });
  }

  openActivityModal(activity: any) {
    this.selectedActivity = {
      ...activity,
      location: activity.lugar || 'Ubicación no disponible',
      time: activity.inicio ? new Date(activity.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hora no disponible',
      description: activity.descripcion || 'Sin descripción'
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
