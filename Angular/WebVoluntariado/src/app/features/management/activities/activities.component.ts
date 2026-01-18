import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from '../../../services/activities.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { EntitiesService } from '../../../services/entities.service';
import { AuthService } from '../../../services/auth.service';
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
    joinedActivities: any[] = [];

    selectedActivity: any = null;
    isModalOpen = false;
    isLoading = true;

    private activitiesService = inject(ActivitiesService);
    private tipoActividadService = inject(TipoActividadService);
    private entitiesService = inject(EntitiesService);
    private authService = inject(AuthService);
    private router = inject(Router);

    allActivities: any[] = [];
    filteredActivities: any[] = [];
    types: any[] = [];
    entities: any[] = [];
    isSearchActive = false;

    currentUser: any = null;
    userRole: string = '';

    searchTerm: string = '';
    selectedType: string = '';
    selectedDate: string = '';
    selectedEntity: string = '';

    ngOnInit() {
        this.isLoading = true;
        this.currentUser = this.authService.getCurrentUser();
        this.userRole = this.currentUser?.role || '';

        // this.currentUser = this.currentUser?.details; // Removed incorrect flattening

        this.loadActivities();

        this.tipoActividadService.getAll().subscribe(data => {
            this.types = data;
        });

        this.entitiesService.getAll().subscribe(data => {
            this.entities = data;
        });
    }

    loadActivities() {
        this.activitiesService.getAll().subscribe({
            next: (data) => {
                if (this.userRole === 'entity') {
                    // Filter activities for the logged-in entity
                    // The backend returns a flat user object where 'id' is the entity ID
                    const entityId = this.currentUser?.id;
                    if (entityId) {
                        data = data.filter((a: any) => a.convoca?.idEntidad === entityId);
                    }
                }
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

                if (this.userRole === 'volunteer' && this.currentUser?.nif) {
                    this.joinedActivities = data.filter(a =>
                        a.voluntarios?.some((v: any) => v.nif === this.currentUser.nif)
                    );
                }

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading activities', err);
                this.isLoading = false;
            }
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

    get modalMode(): 'student' | 'management' | 'preview' | 'readonly' {
        if (this.userRole === 'volunteer') return 'student';
        return 'management';
    }

    get modalButtonType(): 'participar' | 'valorar' | 'informar' | 'abandonar' {
        if (this.userRole === 'volunteer' && this.selectedActivity && this.currentUser?.nif) {
            const isJoined = this.selectedActivity.voluntarios?.some((v: any) => v.nif === this.currentUser.nif);
            if (isJoined) return 'abandonar';
        }
        return 'participar';
    }

    onActivityAction() {
        if (this.userRole === 'volunteer' && this.selectedActivity && this.currentUser?.nif) {
            const isJoined = this.selectedActivity.voluntarios?.some((v: any) => v.nif === this.currentUser.nif);

            this.isLoading = true;

            if (isJoined) {
                this.activitiesService.leaveActivity(this.selectedActivity.idActividad, this.currentUser.nif).subscribe({
                    next: () => {
                        this.loadActivities(); // Refresh to update lists
                        this.closeActivityModal();
                        alert('Has abandonado la actividad correctamente.');
                    },
                    error: (err) => {
                        console.error('Error leaving activity', err);
                        this.isLoading = false;
                        alert('Error al abandonar la actividad.');
                    }
                });
            } else {
                this.activitiesService.joinActivity(this.selectedActivity.idActividad, this.currentUser.nif).subscribe({
                    next: () => {
                        this.loadActivities(); // Refresh to update lists
                        this.closeActivityModal();
                        alert('Te has inscrito correctamente.');
                    },
                    error: (err) => {
                        console.error('Error joining activity', err);
                        this.isLoading = false;
                        const msg = err.error?.error || 'Error al inscribirse en la actividad.';
                        alert(msg);
                    }
                });
            }
        }
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
                        this.loadActivities();
                        this.closeActivityModal();
                        alert('Actividad eliminada correctamente.');
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
