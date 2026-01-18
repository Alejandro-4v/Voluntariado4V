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
  myUpcomingActivities: any[] = [];
  allAvailableActivities: any[] = [];
  otherEntities: any[] = [];

  // Modal state
  selectedActivity: any = null;
  isModalOpen = false;
  isEnrolling = false;

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

        // My Upcoming Activities (Enrolled & Future)
        this.myUpcomingActivities = activities
          .filter(a => new Date(a.inicio) >= now && a.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif))
          .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

        // All Available Activities (Discovery)
        // Show all active upcoming activities
        // All Available Activities (Discovery)
        // Show all active upcoming activities that match grade and are not enrolled
        this.allAvailableActivities = activities
          .filter(a => {
            const isFuture = new Date(a.inicio) >= now;
            const isActive = a.estado === 'A';
            const isNotEnrolled = !a.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif);
            const matchesGrade = !a.grado || !this.currentUser?.gradeId || a.grado.idGrado === this.currentUser.gradeId;
            return isFuture && isActive && isNotEnrolled && matchesGrade;
          })
          .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

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
    if (!this.currentUser || !this.currentUser.nif) {
      alert('Debes iniciar sesión como voluntario para inscribirte.');
      return;
    }

    if (!this.selectedActivity) return;

    // Check if already enrolled
    const isEnrolled = this.selectedActivity.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif);
    if (isEnrolled) {
      alert('Ya estás inscrito en esta actividad.');
      return;
    }

    this.isEnrolling = true;
    this.activitiesService.enrollVolunteer(this.selectedActivity.idActividad, this.currentUser.nif).subscribe({
      next: (updatedActivity) => {
        alert('¡Te has inscrito correctamente en la actividad!');
        this.isEnrolling = false;
        this.closeActivityModal();
        this.loadData(); // Reload to reflect changes (e.g. remove from list if logic changes, or just refresh)
      },
      error: (err) => {
        console.error('Error enrolling in activity', err);
        alert('Hubo un error al inscribirse. Por favor, inténtalo de nuevo.');
        this.isEnrolling = false;
      }
    });
  }
}
