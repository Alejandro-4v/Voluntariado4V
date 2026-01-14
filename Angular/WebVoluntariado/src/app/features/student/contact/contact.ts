import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { ActivitiesService } from '../../../services/activities.service';
import { EntitiesService } from '../../../services/entities.service';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';
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
  private activitiesService = inject(ActivitiesService);
  private entitiesService = inject(EntitiesService);

  currentUser: User | null = null;
  allActivities: any[] = []; // Past activities
  upcomingActivities: any[] = [];
  entities: any[] = [];
  selectedActivity: any = null;
  isModalOpen = false;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/iniciar-sesion']);
      return;
    }

    // Fetch all activities
    this.activitiesService.getAll().subscribe(activities => {
      const now = new Date();

      // Past activities for the current user
      // Assuming we filter by user participation if available in the model or just showing all past for now if not linked
      // The previous mock logic filtered by user ID. The API model has 'voluntarios' array in activity.
      // We can check if currentUser.nif is in activity.voluntarios

      this.allActivities = activities.filter(a => {
        const isPast = new Date(a.fin) < now;
        const isParticipant = a.voluntarios?.some(v => v.nif === this.currentUser?.nif);
        return isPast && isParticipant;
      }).sort((a, b) => new Date(b.fin).getTime() - new Date(a.fin).getTime());


      // Upcoming activities (Available for everyone)
      this.upcomingActivities = activities.filter(a => {
        return new Date(a.inicio) >= now && a.estado === 'A'; // 'A' for Active/Approved
      }).sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
    });

    // Fetch entities
    this.entitiesService.getAll().subscribe(entities => {
      this.entities = entities;
    });
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
