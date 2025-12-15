import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../services/activities.service';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, AppCarrouselComponent, ActivityModalComponent, FilterSortComponent],
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

    private allUpcoming: any[] = [];
    private allPast: any[] = [];
    private allPending: any[] = [];
    private allProposals: any[] = [];

    sortOptions = [
        { label: 'Nombre', value: 'name' }
    ];

    groupOptions = [
        { label: 'Entidad/Tipo', value: 'type' },
        { label: 'Ninguno', value: '' }
    ];

    ngOnInit() {
        this.activitiesService.getUpcomingActivities().subscribe(data => {
            this.allUpcoming = data;
            this.upcomingActivities = [...data];
        });
        this.activitiesService.getPastActivities().subscribe(data => {
            this.allPast = data;
            this.pastActivities = [...data];
        });
        this.activitiesService.getPendingActivities().subscribe(data => {
            this.allPending = data;
            this.pendingActivities = [...data];
        });
        this.activitiesService.getProposals().subscribe(data => {
            this.allProposals = data;
            this.proposals = [...data];
        });
    }

    onSortBy(criteria: string) {
        const sortFn = (a: any, b: any) => {
            if (criteria === 'name') return a.name.localeCompare(b.name);
            // Add more sort criteria if needed, e.g. date
            return 0;
        };
        this.upcomingActivities.sort(sortFn);
        this.pastActivities.sort(sortFn);
        this.pendingActivities.sort(sortFn);
        this.proposals.sort(sortFn);
    }

    onGroupBy(criteria: string) {
        // Simple grouping by sorting for now, similar to other lists
        // If criteria is 'type' (Entity/Category)
        if (criteria === 'type') {
            const sortFn = (a: any, b: any) => (a.type || '').localeCompare(b.type || '');
            this.upcomingActivities.sort(sortFn);
            this.pastActivities.sort(sortFn);
            this.pendingActivities.sort(sortFn);
            this.proposals.sort(sortFn);
        } else {
            // Reset to original order or just re-fetch/reset from cached "all"
            this.upcomingActivities = [...this.allUpcoming];
            this.pastActivities = [...this.allPast];
            this.pendingActivities = [...this.allPending];
            this.proposals = [...this.allProposals];
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

    onEditActivity() {
        console.log('Edit activity:', this.selectedActivity);
        this.closeActivityModal();
    }

    onDeleteActivity() {
        console.log('Delete activity:', this.selectedActivity);
        this.closeActivityModal();
    }
}
