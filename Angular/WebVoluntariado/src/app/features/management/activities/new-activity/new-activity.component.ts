import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';
import { ActivitiesService } from '../../../../services/activities.service';
import { ActivityModalComponent } from '../../../../shared/components/activity-modal/activity-modal';
import { OdsService } from '../../../../services/ods.service';
import { TipoActividadService } from '../../../../services/tipo-actividad.service';
import { EntitiesService } from '../../../../services/entities.service';
import { GradoService } from '../../../../services/grado.service';

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
    private odsService = inject(OdsService);
    private tipoActividadService = inject(TipoActividadService);
    private entitiesService = inject(EntitiesService);
    private gradoService = inject(GradoService);

    odsList: any[] = [];
    typesList: any[] = [];
    entitiesList: any[] = [];
    gradosList: any[] = [];

    isModalOpen = false;
    previewActivity: any = null;

    ngOnInit(): void {
        this.odsService.getAll().subscribe(data => this.odsList = data);
        this.tipoActividadService.getAll().subscribe(data => this.typesList = data);
        this.entitiesService.getAll().subscribe(data => this.entitiesList = data);
        this.gradoService.getAll().subscribe(data => this.gradosList = data);
    }

    onSave(activityData: any): void {
        console.log('NewActivityComponent: onSave called', activityData);
        const newActivity = this.mapToActivity(activityData, 'A');
        console.log('Mapped Activity:', newActivity);

        this.activitiesService.create(newActivity).subscribe({
            next: () => {
                console.log('Activity published successfully');
                this.router.navigate(['/management/actividades']);
            },
            error: (err) => {
                console.error('Error creating activity:', err);
                alert('Error al crear la actividad. Consulta la consola para más detalles.');
            }
        });
    }



    onPreview(activityData: any): void {
        const activity = this.mapToActivity(activityData, 'P');
        // Enrich with entity name for preview
        const entity = this.entitiesList.find(e => e.idEntidad === activity.convoca.idEntidad);
        if (entity) {
            activity.convoca.nombre = entity.nombre;
            activity.convoca.contactMail = entity.contactMail; // Also add contact mail for preview
        }
        // Enrich with grado description
        const grado = this.gradosList.find(g => g.idGrado === activity.grado.idGrado);
        if (grado) {
            activity.grado.descripcion = grado.descripcion;
            activity.grado.nivel = grado.nivel;
        }
        // Enrich types
        activity.tiposActividad = activity.tiposActividad.map((t: any) => {
            const type = this.typesList.find(tl => tl.idTipoActividad === t.idTipoActividad);
            return type ? type : t;
        });
        // Enrich ODS
        activity.ods = activity.ods.map((o: any) => {
            const ods = this.odsList.find(ol => ol.idOds === o.idOds);
            return ods ? ods : o;
        });

        this.previewActivity = activity;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.previewActivity = null;
    }

    private mapToActivity(formData: any, status: string): any {
        console.log('Mapping formData to Activity:', formData);
        return {
            nombre: formData.name,
            descripcion: formData.description,
            estado: status,
            inicio: formData.date,
            fin: formData.date, // Defaulting end date to start date for now
            imagenUrl: formData.image || 'https://via.placeholder.com/300', // Default image if none
            convoca: { idEntidad: Number(formData.entity) },
            plazas: Number(formData.slots),
            grado: { idGrado: Number(formData.grado) },
            tiposActividad: formData.types.map((id: any) => ({ idTipoActividad: Number(id) })),
            ods: formData.ods.map((id: any) => ({ idOds: Number(id) })),
            lugar: formData.location || 'Ubicación pendiente', // Fallback to prevent null error
            voluntarios: []
        };
    }
}
