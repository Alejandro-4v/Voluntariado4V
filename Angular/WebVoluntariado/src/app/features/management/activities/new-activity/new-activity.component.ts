import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';
import { ActivitiesService } from '../../../../services/activities.service';
import { ActivityModalComponent } from '../../../../shared/components/activity-modal/activity-modal';

@Component({
    selector: 'app-new-activity',
    standalone: true,
    imports: [CommonModule, ActivityFormComponent, ActivityModalComponent],
    templateUrl: './new-activity.component.html',
    styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent {

    private activitiesService = inject(ActivitiesService);
    private router = inject(Router);

    isModalOpen = false;
    previewActivity: any = null;

    onSave(activityData: any): void {
        const newActivity = this.mapToActivity(activityData, 'A');
        this.activitiesService.create(newActivity).subscribe(() => {
            console.log('Activity published');
            this.router.navigate(['/management/activities']);
        });
    }

    onDraft(activityData: any): void {
        const newActivity = this.mapToActivity(activityData, 'P');
        this.activitiesService.create(newActivity).subscribe(() => {
            console.log('Activity saved as draft');
            this.router.navigate(['/management/activities']);
        });
    }

    onPreview(activityData: any): void {
        this.previewActivity = this.mapToActivity(activityData, 'P'); // Status doesn't matter for preview
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.previewActivity = null;
    }

    private mapToActivity(formData: any, status: string): any {
        return {
            nombre: formData.name,
            descripcion: formData.description,
            estado: status,
            inicio: formData.date,
            fin: formData.date, // Defaulting end date to start date for now
            imagenUrl: formData.image || 'https://via.placeholder.com/300', // Default image if none
            convoca: { nombre: formData.entity }, // Simplified entity mapping
            plazasTotales: formData.slots, // Mapping slots
            // Default values for required fields not in form
            grado: { nombre: 'Grado Medio' },
            tiposActividad: [{ descripcion: 'Voluntariado' }],
            ods: [],
            voluntarios: []
        };
    }
}
