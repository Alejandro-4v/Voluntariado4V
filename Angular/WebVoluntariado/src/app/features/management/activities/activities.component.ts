import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from '../../../services/activities.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { EntitiesService } from '../../../services/entities.service';
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
    private tipoActividadService = inject(TipoActividadService);
    private entitiesService = inject(EntitiesService);

    allActivities: any[] = [];
    filteredActivities: any[] = [];
    types: any[] = [];
    entities: any[] = [];
    isSearchActive = false;

    // Search filters
    searchTerm: string = '';
    selectedType: string = '';
    selectedDate: string = '';
    selectedEntity: string = '';

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

        this.tipoActividadService.getAll().subscribe(data => {
            this.types = data;
        });

        this.entitiesService.getAll().subscribe(data => {
            this.entities = data;
        });
    }

    onSearch() {
        // If no filters are active, show carousels
        if (!this.selectedType && !this.selectedDate && !this.searchTerm && !this.selectedEntity) {
            this.isSearchActive = false;
            return;
        }

        this.isSearchActive = true;
        this.filteredActivities = this.allActivities.filter(activity => {
            let matchesType = true;
            let matchesDate = true;
            let matchesSearch = true;
            let matchesEntity = true;

            // Filter by Type
            if (this.selectedType && this.selectedType !== '') {
                const selectedTypeObj = this.types.find(t => t.idTipoActividad == this.selectedType);
                if (selectedTypeObj) {
                    matchesType = activity.tiposActividad?.some((t: any) => t.descripcion === selectedTypeObj.descripcion);
                } else {
                    matchesType = false;
                }
            }

            // Filter by Date
            if (this.selectedDate) {
                const activityDate = new Date(activity.inicio).toDateString();
                const filterDate = new Date(this.selectedDate).toDateString();
                matchesDate = activityDate === filterDate;
            }

            // Filter by Entity
            if (this.selectedEntity && this.selectedEntity !== '') {
                matchesEntity = activity.convoca?.nombre === this.selectedEntity;
            }

            // Filter by Search Term (Name or Description)
            if (this.searchTerm) {
                const term = this.searchTerm.toLowerCase();
                matchesSearch = (activity.nombre?.toLowerCase().includes(term) ||
                    activity.descripcion?.toLowerCase().includes(term));
            }

            return matchesType && matchesDate && matchesSearch && matchesEntity;
        });

        // Sort by date descending
        this.filteredActivities.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }

    onViewAll() {
        this.isSearchActive = true;
        this.filteredActivities = [...this.allActivities];
        // Sort by date descending
        this.filteredActivities.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }

    onClear() {
        this.selectedType = '';
        this.selectedDate = '';
        this.searchTerm = '';
        this.selectedEntity = '';
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

    private router = inject(Router);

    onEditActivity() {
        if (this.selectedActivity && this.selectedActivity.idActividad) {
            this.router.navigate(['/management/actividades/editar', this.selectedActivity.idActividad]);
        }
        this.closeActivityModal();
    }

    onDeleteActivity() {
        console.log('Delete activity:', this.selectedActivity);
        this.closeActivityModal();
    }
}
