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
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp, staggerFade } from '../../../shared/animations/animations';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, FormsModule, AppCarrouselComponent, ActivityModalComponent, ActivityCardComponent, LoadingSpinnerComponent],
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss'],
    animations: [fadeIn, slideUp, staggerFade]
})
export class ManagementActivitiesComponent implements OnInit {

    upcomingActivities: any[] = [];
    pastActivities: any[] = [];
    pendingActivities: any[] = [];
    proposals: any[] = [];

    selectedActivity: any = null;
    isModalOpen = false;
    isLoading = true;

    private activitiesService = inject(ActivitiesService);
    private tipoActividadService = inject(TipoActividadService);
    private entitiesService = inject(EntitiesService);
    private router = inject(Router);

    allActivities: any[] = [];
    filteredActivities: any[] = [];
    types: any[] = [];
    entities: any[] = [];
    isSearchActive = false;

    
    searchTerm: string = '';
    selectedType: string = '';
    selectedDate: string = '';
    selectedEntity: string = '';

    ngOnInit() {
        this.isLoading = true;
        this.activitiesService.getAll().subscribe({
            next: (data) => {
                this.allActivities = data;
                const now = new Date();

                
                this.upcomingActivities = data.filter(a => new Date(a.inicio) > now);

                this.pastActivities = data.filter(a => {
                    const endDate = a.fin ? new Date(a.fin) : new Date(a.inicio);
                    return endDate < now;
                });

                this.pendingActivities = data.filter(a => a.estado === 'P');

                
                this.proposals = data.filter(a =>
                    a.convoca?.nombre?.toLowerCase().includes('cuatrovientos') ||
                    a.convoca?.nombre?.toLowerCase().includes('4v')
                );

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading activities', err);
                this.isLoading = false;
            }
        });

        this.tipoActividadService.getAll().subscribe(data => {
            this.types = data;
        });

        this.entitiesService.getAll().subscribe(data => {
            this.entities = data;
        });
    }

    onSearch() {
        
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

            
            if (this.selectedType && this.selectedType !== '') {
                const selectedTypeObj = this.types.find(t => t.idTipoActividad == this.selectedType);
                if (selectedTypeObj) {
                    matchesType = activity.tiposActividad?.some((t: any) => t.descripcion === selectedTypeObj.descripcion);
                } else {
                    matchesType = false;
                }
            }

            
            if (this.selectedDate) {
                const activityDate = new Date(activity.inicio).toDateString();
                const filterDate = new Date(this.selectedDate).toDateString();
                matchesDate = activityDate === filterDate;
            }

            
            if (this.selectedEntity && this.selectedEntity !== '') {
                matchesEntity = activity.convoca?.nombre === this.selectedEntity;
            }

            
            if (this.searchTerm) {
                const term = this.searchTerm.toLowerCase();
                matchesSearch = (activity.nombre?.toLowerCase().includes(term) ||
                    activity.descripcion?.toLowerCase().includes(term));
            }

            return matchesType && matchesDate && matchesSearch && matchesEntity;
        });

        
        this.filteredActivities.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }

    onViewAll() {
        this.isSearchActive = true;
        this.filteredActivities = [...this.allActivities];
        
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

    onEditActivity() {
        if (this.selectedActivity && this.selectedActivity.idActividad) {
            this.router.navigate(['/management/actividades/editar', this.selectedActivity.idActividad]);
        }
        this.closeActivityModal();
    }

    onDeleteActivity() {
        if (this.selectedActivity && this.selectedActivity.idActividad) {
            if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
                this.activitiesService.delete(this.selectedActivity.idActividad).subscribe({
                    next: () => {
                        console.log('Activity deleted');
                        
                        this.ngOnInit();
                        this.closeActivityModal();
                    },
                    error: (err) => {
                        console.error('Error deleting activity', err);
                        alert('Error al eliminar la actividad');
                    }
                });
            }
        }
    }
}
