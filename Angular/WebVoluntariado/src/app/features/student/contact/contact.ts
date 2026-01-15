import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { ActivitiesService } from '../../../services/activities.service';
import { EntitiesService } from '../../../services/entities.service';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp } from '../../../shared/animations/animations';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent, LoadingSpinnerComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  animations: [fadeIn, slideUp]
})
export class ContactComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private activitiesService = inject(ActivitiesService);
  private entitiesService = inject(EntitiesService);

  currentUser: User | null = null;
  allActivities: any[] = []; // Past activities
  upcomingActivities: any[] = [];
  entities: any[] = [];
  selectedActivity: any = null;
  isModalOpen = false;
  isLoading = true;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/iniciar-sesion']);
      return;
    }

    this.isLoading = true;

    // Fetch all activities
    this.activitiesService.getAll().subscribe({
      next: (activities) => {
        const now = new Date();

        // Past activities for the current user
        this.allActivities = activities.filter(a => {
          const isPast = new Date(a.fin) < now;
          const isParticipant = a.voluntarios?.some(v => v.nif === this.currentUser?.nif);
          return isPast && isParticipant;
        }).sort((a, b) => new Date(b.fin).getTime() - new Date(a.fin).getTime());


        // Upcoming activities (Available for everyone)
        this.upcomingActivities = activities.filter(a => {
          return new Date(a.inicio) >= now && a.estado === 'A'; // 'A' for Active/Approved
        }).sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

        this.checkLoading();
      },
      error: (err) => {
        console.error('Error loading activities', err);
        this.checkLoading();
      }
    });

    // Fetch entities
    this.entitiesService.getAll().subscribe({
      next: (entities) => {
        this.entities = entities;
        this.checkLoading();
      },
      error: (err) => {
        console.error('Error loading entities', err);
        this.checkLoading();
      }
    });
  }

  private loadCount = 0;
  private checkLoading() {
    this.loadCount++;
    if (this.loadCount >= 2) {
      this.isLoading = false;
    }
  }

  openActivityModal(activity: any) {
    this.selectedActivity = activity;
    this.isModalOpen = true;
  }

  closeActivityModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  onActivityAction() {
    console.log('Participar:', this.selectedActivity?.nombre);
    this.closeActivityModal();
  }
}
