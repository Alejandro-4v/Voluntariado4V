import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';
import { ActivitiesService } from '../../../../services/activities.service';
import { ActivityModalComponent } from '../../../../shared/components/activity-modal/activity-modal';
import { OdsService } from '../../../../services/ods.service';
import { TipoActividadService } from '../../../../services/tipo-actividad.service';
import { EntitiesService } from '../../../../services/entities.service';
import { GradoService } from '../../../../services/grado.service';

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
    private odsService = inject(OdsService);
    private tipoActividadService = inject(TipoActividadService);
    private entitiesService = inject(EntitiesService);
    private gradoService = inject(GradoService);

    odsList: any[] = [];
    typesList: any[] = [];
    entitiesList: any[] = [];
    gradosList: any[] = [];

    ngOnInit(): void {
        this.odsService.getAll().subscribe(data => this.odsList = data);
        this.tipoActividadService.getAll().subscribe(data => this.typesList = data);
        this.entitiesService.getAll().subscribe(data => this.entitiesList = data);
        this.gradoService.getAll().subscribe(data => this.gradosList = data);

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.activitiesService.getById(+id).subscribe(data => {
                this.activityData = {
                    ...data,
                    name: data.nombre,
                    description: data.descripcion,
                    date: data.inicio,
                    location: data.lugar || 'Ubicación no especificada',
                    slots: data.plazas,
                    entity: data.convoca?.idEntidad, 
                    grado: data.grado?.idGrado, 
                    image: data.imagenUrl,
                    ods: data.ods,
                    types: data.tiposActividad
                };
            });
        }
    }

    isLoading = false;

    onSave(updatedData: any): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isLoading = true;
            const updatedActivity = this.mapToActivity(updatedData, 'A');
            this.activitiesService.update(+id, updatedActivity).subscribe({
                next: () => {
                    console.log('Activity updated');
                    alert('Actividad guardada correctamente');
                    this.router.navigate(['/management/actividades']);
                },
                error: (err: any) => {
                    console.error('Error updating activity:', err);
                    alert('Error al actualizar la actividad.');
                    this.isLoading = false;
                }
            });
        }
    }



    onPreview(updatedData: any): void {
        const activity = this.mapToActivity(updatedData, 'P');
        
        const entity = this.entitiesList.find(e => e.idEntidad === activity.convoca.idEntidad);
        if (entity) {
            activity.convoca.nombre = entity.nombre;
            activity.convoca.contactMail = entity.contactMail;
        }
        
        const grado = this.gradosList.find(g => g.idGrado === activity.grado.idGrado);
        if (grado) {
            activity.grado.descripcion = grado.descripcion;
            activity.grado.nivel = grado.nivel;
        }
        
        activity.tiposActividad = activity.tiposActividad.map((t: any) => {
            const type = this.typesList.find(tl => tl.idTipoActividad === t.idTipoActividad);
            return type ? type : t;
        });
        
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
        
        const inicio = formData.date && formData.startTime ? `${formData.date}T${formData.startTime}:00` : null;
        const fin = formData.endDate && formData.endTime ? `${formData.endDate}T${formData.endTime}:00` : null;

        return {
            nombre: formData.name,
            descripcion: formData.description,
            estado: formData.status || status,
            inicio: inicio,
            fin: fin,
            imagenUrl: formData.image || 'https://via.placeholder.com/300',
            convoca: { idEntidad: Number(formData.entity) },
            plazas: Number(formData.slots),
            grado: { idGrado: Number(formData.grado) },
            tiposActividad: formData.types?.map((id: any) => ({ idTipoActividad: Number(id) })) || [],
            ods: formData.ods?.map((id: any) => ({ idOds: Number(id) })) || [],
            lugar: formData.location,
            voluntarios: []
        };
    }
}
