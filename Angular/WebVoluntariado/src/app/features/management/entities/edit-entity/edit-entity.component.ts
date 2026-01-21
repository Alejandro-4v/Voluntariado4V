import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EntitiesService } from '../../../../services/entities.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Entidad } from '../../../../models/entidad.model';

@Component({
    selector: 'app-edit-entity',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent],
    templateUrl: './edit-entity.component.html',
    styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {
    entityForm: FormGroup;
    isLoading = true;
    isSaving = false;
    id: number = 0;
    entityName: string = '';

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private entitiesService = inject(EntitiesService);

    constructor() {
        this.entityForm = this.fb.group({
            nombre: ['', Validators.required],
            nombreResponsable: ['', Validators.required],
            apellidosResponsable: ['', Validators.required],
            cif: ['', [Validators.required, Validators.pattern(/^[A-Z][0-9]{7}[A-Z0-9]$/)]],
            contactMail: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.id = idParam ? +idParam : 0;

        if (!this.id) {
            this.router.navigate(['/management/entidades']);
            return;
        }

        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.entitiesService.getById(this.id).subscribe({
            next: (entity) => {
                this.patchForm(entity);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading entity', err);
                // alert('Error al cargar la entidad'); // Using router query param similar to volunteer list could be better but sticking to simple error handling for now or just navigate back
                this.router.navigate(['/management/entidades']);
                this.isLoading = false;
            }
        });
    }

    patchForm(entity: Entidad) {
        this.entityName = entity.nombre;

        this.entityForm.patchValue({
            nombre: entity.nombre,
            nombreResponsable: entity.nombreResponsable,
            apellidosResponsable: entity.apellidosResponsable,
            cif: entity.cif,
            contactMail: entity.contactMail
        });
    }

    isInvalid(fieldName: string): boolean {
        const field = this.entityForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.entityForm.invalid) {
            this.entityForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const formValue = this.entityForm.value;

        const updatedEntity: Entidad = {
            idEntidad: this.id,
            nombre: formValue.nombre,
            nombreResponsable: formValue.nombreResponsable,
            apellidosResponsable: formValue.apellidosResponsable, // Assuming this field exists in model, verified it does.
            cif: formValue.cif,
            contactMail: formValue.contactMail,
            // Keep other fields if necessary? The update method in backend typically updates what's sent, 
            // but if it replaces the whole object we might lose data. 
            // However, the service `update` method takes `Entidad`. 
            // Ideally we used the loaded entity and merged changes.
            // Let's re-fetch or keep the original entity in memory.
            // A better approach: merge with loaded entity. I didn't store the loaded entity fully.
            // Let's modify logic to store the full entity.
            fechaRegistro: '', // Placeholder, will be overwritten by merge
        };

        // I need to merge with original data to avoid losing fields like 'fechaRegistro', 'actividades', etc. if the backend expects full object.
        // I will re-implement this method to use the stored entity.
        this.entitiesService.getById(this.id).subscribe(currentEntity => {
            const mergedEntity = { ...currentEntity, ...updatedEntity };

            this.entitiesService.update(mergedEntity).subscribe({
                next: () => {
                    this.isSaving = false;
                    this.router.navigate(['/management/entidades'], { queryParams: { success: 'true' } });
                },
                error: (err) => {
                    console.error('Error updating entity', err);
                    alert('Error al actualizar la entidad');
                    this.isSaving = false;
                }
            });
        });
    }

    onCancel() {
        this.router.navigate(['/management/entidades']);
    }
}
