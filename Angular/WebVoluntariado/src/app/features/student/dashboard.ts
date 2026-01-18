import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { EntitiesService } from '../../services/entities.service';
import { AppCarrouselComponent } from '../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../shared/components/activity-modal/activity-modal';
import { EntityModalComponent } from '../../shared/components/entity-modal/entity-modal';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp, staggerFade } from '../../shared/animations/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppCarrouselComponent,
    ActivityModalComponent,
    EntityModalComponent,
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


  isLoading = true;


  myUpcomingActivities: any[] = [];
  allAvailableActivities: any[] = [];
  allActivities: any[] = []; // Store raw list
  otherEntities: any[] = [];


  selectedActivity: any = null;
  isModalOpen = false;
  isEnrolling = false;
  modalMode: 'student' | 'readonly' = 'student';

  // Entity Modal properties
  selectedEntity: any = null;
  entityActivities: any[] = [];
  isEntityModalOpen = false;




  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;


    this.activitiesService.getAll().subscribe({
      next: (activities) => {
        this.allActivities = activities;
        const now = new Date();


        this.myUpcomingActivities = activities
          .filter(a => new Date(a.inicio) >= now && a.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif))
          .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

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

  openActivityModal(activity: any, mode: 'student' | 'readonly' = 'student') {
    this.selectedActivity = activity;
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeActivityModal() {
    this.isModalOpen = false;
    this.selectedActivity = null;
  }

  get modalButtonType(): 'participar' | 'valorar' | 'informar' | 'abandonar' {
    if (this.selectedActivity && this.currentUser?.nif) {
      const isJoined = this.selectedActivity.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif);
      if (isJoined) return 'abandonar';
    }
    return 'participar';
  }

  onActivityAction() {
    if (!this.currentUser || !this.currentUser.nif) {
      alert('Debes iniciar sesión como voluntario para inscribirte.');
      return;
    }

    if (!this.selectedActivity) return;

    const isEnrolled = this.selectedActivity.voluntarios?.some((v: any) => v.nif === this.currentUser?.nif);

    this.isEnrolling = true;

    if (isEnrolled) {
      // Leave Activity
      this.activitiesService.leaveActivity(this.selectedActivity.idActividad, this.currentUser.nif).subscribe({
        next: () => {
          alert('Has abandonado la actividad correctamente.');
          this.isEnrolling = false;
          this.closeActivityModal();
          this.loadData();
        },
        error: (err) => {
          console.error('Error leaving activity', err);
          alert('Hubo un error al abandonar la actividad.');
          this.isEnrolling = false;
        }
      });
    } else {
      // Join Activity
      this.activitiesService.joinActivity(this.selectedActivity.idActividad, this.currentUser.nif).subscribe({
        next: () => {
          alert('¡Te has inscrito correctamente en la actividad!');
          this.isEnrolling = false;
          this.closeActivityModal();
          this.loadData();
        },
        error: (err) => {
          console.error('Error enrolling in activity', err);
          alert('Hubo un error al inscribirse. Por favor, inténtalo de nuevo.');
          this.isEnrolling = false;
        }
      });
    }
  }

  openEntityModal(entity: any) {
    this.selectedEntity = entity;
    const now = new Date();
    // Filter activities for this entity that are active and future (or whatever criteria fits "to which I could join")
    // "activities they've got to which I could join" -> Future & Active & Not Enrolled (Wait, they might want to see ones they ARE enrolled in too? safer to show all valid ones)
    // I will show all future active activities for this entity.

    // Logic from allAvailableActivities: isFuture && isActive && matchesGrade.
    // I will use similar logic but restricted to this entity.

    this.entityActivities = this.allActivities.filter(a => {
      const convocaMatch = (a.convoca && a.convoca.idEntidad === entity.idEntidad) || (a.convoca === entity.idEntidad); // Handle object or ID
      if (!convocaMatch) return false;

      const isFuture = new Date(a.inicio) >= now;
      const isActive = a.estado === 'A';
      const matchesGrade = !a.grado || !this.currentUser?.gradeId || a.grado.idGrado === this.currentUser.gradeId;

      return isFuture && isActive && matchesGrade;
    }).sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

    this.isEntityModalOpen = true;
  }

  closeEntityModal() {
    this.isEntityModalOpen = false;
    this.selectedEntity = null;
  }
}
