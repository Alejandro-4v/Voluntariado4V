import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';
import { ActivitiesService } from '../../../../services/activities.service';
import { ActivityModalComponent } from '../../../../shared/components/activity-modal/activity-modal';

@Component({
    selector: 'app-edit-activity',
    standalone: true,
    imports: [CommonModule, ActivityFormComponent, ActivityModalComponent],
    templateUrl: './edit-activity.component.html',
    styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {
    activityData: any = null;
    isModalOpen = false;
    previewActivity: any = null;

    private activitiesService = inject(ActivitiesService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.activitiesService.getById(+id).subscribe(data => {
                this.activityData = {
                    ...data,
                    name: data.nombre,
                    description: data.descripcion,
                    date: data.inicio,
                    location: 'Ubicación no especificada', // Mock location if missing
                    slots: data.plazasTotales,
                    entity: data.convoca?.nombre,
                    image: data.imagenUrl,
                    ods: data.ods,
                    types: data.tiposActividad
                };
            });
        }
    }

    onSave(updatedData: any): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const updatedActivity = this.mapToActivity(updatedData, 'A');
            this.activitiesService.update(+id, updatedActivity).subscribe(() => {
                console.log('Activity updated');
                this.router.navigate(['/management/actividades']);
            });
        }
    }

    onDraft(updatedData: any): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const updatedActivity = this.mapToActivity(updatedData, 'P');
            this.activitiesService.update(+id, updatedActivity).subscribe(() => {
                console.log('Activity draft updated');
                this.router.navigate(['/management/actividades']);
            });
        }
    }

    onPreview(updatedData: any): void {
        this.previewActivity = this.mapToActivity(updatedData, 'P');
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
            fin: formData.date,
            imagenUrl: formData.image || 'https://via.placeholder.com/300',
            convoca: { nombre: formData.entity },
            plazasTotales: formData.slots,
            grado: { nombre: 'Grado Medio' },
            tiposActividad: formData.types?.map((id: any) => ({ idTipoActividad: id })) || [],
            ods: formData.ods?.map((id: any) => ({ idOds: id })) || [],
            voluntarios: []
        };
    }
}
