import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { EntitiesService } from '../../services/entities.service';
import { AppCarrouselComponent } from '../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../shared/components/activity-modal/activity-modal';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp, staggerFade } from '../../shared/animations/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppCarrouselComponent,
    ActivityModalComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  animations: [fadeIn, slideUp, staggerFade]
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private activitiesService = inject(ActivitiesService);
  private entitiesService = inject(EntitiesService);

  currentUser: User | null = null;

  // Loading state
  isLoading = true;

  // Data
  groupedActivities: { entityName: string, activities: any[] }[] = [];
  proposalsFromCuatrovientos: any[] = [];
  otherEntities: any[] = [];

  // Modal state
  selectedActivity: any = null;
  isModalOpen = false;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // if (!this.currentUser) {
    //   this.router.navigate(['/auth/iniciar-sesion']);
    //   return;
    // }
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Fetch activities
    this.activitiesService.getAll().subscribe({
      next: (activities) => {
        const now = new Date();

        // Filter and Group "New Activities" by Entity
        const upcomingActivities = activities
          .filter(a => new Date(a.inicio) >= now && a.estado === 'A' && a.convoca?.nombre !== 'Cuatrovientos')
          .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

        const groups: { [key: string]: any[] } = {};
        upcomingActivities.forEach(a => {
          const entityName = a.convoca?.nombre || 'Otras';
          if (!groups[entityName]) {
            groups[entityName] = [];
          }
          groups[entityName].push(a);
        });

        this.groupedActivities = Object.keys(groups).map(key => ({
          entityName: key,
          activities: groups[key]
        }));

        // Filter for "Proposals from Cuatrovientos"
        this.proposalsFromCuatrovientos = activities
          .filter(a => new Date(a.inicio) >= now && a.estado === 'A' && a.convoca?.nombre === 'Cuatrovientos')
          .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())
          .slice(0, 5);

        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading activities', err);
        this.checkLoadingComplete();
      }
    });

    // Fetch entities
    this.entitiesService.getAll().subscribe({
      next: (entities) => {
        this.otherEntities = entities;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading entities', err);
        this.checkLoadingComplete();
      }
    });
  }

  private dataLoadedCount = 0;
  private checkLoadingComplete() {
    this.dataLoadedCount++;
    if (this.dataLoadedCount >= 2) {
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
