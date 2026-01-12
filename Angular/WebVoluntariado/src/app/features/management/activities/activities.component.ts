import { Component, inject, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../services/activities.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';
import { ActivityModalComponent } from '../../../shared/components/activity-modal/activity-modal';
import { ActivityCardComponent } from '../../../shared/components/activity-card/activity-card-component';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, FormsModule, AppCarrouselComponent, ActivityModalComponent, ActivityCardComponent],
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

    allActivities: any[] = [];
    filteredActivities: any[] = [];
    isSearchActive = false;

    // Search filters
    searchTerm: string = '';
    selectedType: string = '';
    selectedDate: string = '';

    ngOnInit() {
        this.activitiesService.getAll().subscribe(data => {
            this.allActivities = data;

            // Filter activities based on state for carousels
            this.upcomingActivities = data.filter(a => a.estado === 'A');
            this.pastActivities = data.filter(a => a.estado === 'F');
            this.pendingActivities = data.filter(a => a.estado === 'P');

            // Assuming proposals are also pending or another state, for now using pending
            this.proposals = []; // Or filter differently if needed
        });
    }

    onSearch() {
        // If no filters are active, show carousels
        if (!this.selectedType && !this.selectedDate && !this.searchTerm) {
            this.isSearchActive = false;
            return;
        }

        this.isSearchActive = true;
        this.filteredActivities = this.allActivities.filter(activity => {
            let matchesType = true;
            let matchesDate = true;
            let matchesSearch = true;

            if (this.selectedType && this.selectedType !== 'Tipos...') {
                // Mock mapping for types (adjust based on actual data structure)
                // Assuming '1' = Voluntariado, '2' = Formación, '3' = Ocio
                // Or check against activity.tipoActividad.descripcion if available
                matchesType = true; // Implement actual type filtering logic
            }

            if (this.selectedDate) {
                // Implement date filtering logic
                matchesDate = true;
            }

            return matchesType && matchesDate && matchesSearch;
        });

        // Sort by date descending
        this.filteredActivities.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    onViewAll() {
        this.isSearchActive = true;
        this.filteredActivities = [...this.allActivities];
        // Sort by date descending
        this.filteredActivities.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    onClear() {
        this.selectedType = '';
        this.selectedDate = '';
        this.searchTerm = '';
        this.isSearchActive = false;
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
