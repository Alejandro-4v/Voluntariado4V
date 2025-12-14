import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../services/activities.service';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent],
    templateUrl: './activities.component.html'
})
export class ManagementActivitiesComponent implements OnInit {

    upcomingActivities: any[] = [];
    pastActivities: any[] = [];
    pendingActivities: any[] = [];
    proposals: any[] = [];

    selectedActivity: any = null;
    isModalOpen = false;

    private activitiesService = inject(ActivitiesService);

    ngOnInit() {
        this.activitiesService.getUpcomingActivities().subscribe(data => this.upcomingActivities = data);
        this.activitiesService.getPastActivities().subscribe(data => this.pastActivities = data);
        this.activitiesService.getPendingActivities().subscribe(data => this.pendingActivities = data);
        this.activitiesService.getProposals().subscribe(data => this.proposals = data);
    }

    openActivityModal(activity: any) {
        this.selectedActivity = activity;
        this.isModalOpen = true;
    }

    closeActivityModal() {
        this.isModalOpen = false;
        this.selectedActivity = null;
    }

    onEditActivity() {
        console.log('Edit activity:', this.selectedActivity);
        this.closeActivityModal();
    }

    onDeleteActivity() {
        console.log('Delete activity:', this.selectedActivity);
        this.closeActivityModal();
    }
}
