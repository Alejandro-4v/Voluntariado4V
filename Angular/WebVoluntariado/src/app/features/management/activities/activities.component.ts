import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../services/activities.service';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent],
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss']
})
export class ManagementActivitiesComponent implements OnInit {

    upcomingActivities: any[] = [];
    pastActivities: any[] = [];
    pendingActivities: any[] = [];
    proposals: any[] = [];

    selectedActivity: any = null;
    isModalOpen = false;

    private activitiesService = inject(ActivitiesService);

    private allUpcoming: any[] = [];
    private allPast: any[] = [];
    private allPending: any[] = [];
    private allProposals: any[] = [];

    ngOnInit() {
        this.activitiesService.getAll().subscribe(data => {
            // Filter activities based on state
            this.allUpcoming = data.filter(a => a.estado === 'A');
            this.upcomingActivities = [...this.allUpcoming];

            this.allPast = data.filter(a => a.estado === 'F');
            this.pastActivities = [...this.allPast];

            this.allPending = data.filter(a => a.estado === 'P');
            this.pendingActivities = [...this.allPending];

            // Assuming proposals are also pending or another state, for now using pending
            this.allProposals = []; // Or filter differently if needed
            this.proposals = [];
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

    onEditActivity() {
        console.log('Edit activity:', this.selectedActivity);
        this.closeActivityModal();
    }

    onDeleteActivity() {
        console.log('Delete activity:', this.selectedActivity);
        this.closeActivityModal();
    }
}
