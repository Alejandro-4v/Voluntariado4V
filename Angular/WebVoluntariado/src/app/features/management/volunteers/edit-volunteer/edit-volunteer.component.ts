import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VolunteersService } from '../../../../services/volunteers.service';
import { GradoService } from '../../../../services/grado.service';
import { TipoActividadService } from '../../../../services/tipo-actividad.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Voluntario } from '../../../../models/voluntario.model';

@Component({
    selector: 'app-edit-volunteer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent],
    templateUrl: './edit-volunteer.component.html',
    styleUrls: ['./edit-volunteer.component.scss']
})
export class EditVolunteerComponent implements OnInit {
    volunteerForm: FormGroup;
    isLoading = true;
    isSaving = false;
    nif: string = '';

    grados: any[] = [];
    tiposActividad: any[] = [];

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private volunteersService = inject(VolunteersService);
    private gradoService = inject(GradoService);
    private tipoActividadService = inject(TipoActividadService);

    constructor() {
        this.volunteerForm = this.fb.group({
            nombre: ['', Validators.required],
            apellido1: ['', Validators.required],
            apellido2: [''],
            mail: ['', [Validators.required, Validators.email]],
            grado: ['', Validators.required],
            estado: ['', Validators.required],
            perfilUrl: [''],
            tiposActividad: [[]] // Array of IDs
        });
    }

    ngOnInit(): void {
        this.nif = this.route.snapshot.paramMap.get('nif') || '';
        if (!this.nif) {
            this.router.navigate(['/management/voluntarios']);
            return;
        }

        this.loadData();
    }

    loadData() {
        this.isLoading = true;

        // Use forkJoin-like logic by nesting subscriptions or using Promise.all if I were using rxjs properly, 
        // but distinct calls are fine for now.

        this.gradoService.getAll().subscribe(grados => {
            this.grados = grados;
        });

        this.tipoActividadService.getAll().subscribe(tipos => {
            this.tiposActividad = tipos;
        });

        this.volunteersService.getById(this.nif).subscribe({
            next: (volunteer) => {
                this.patchForm(volunteer);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading volunteer', err);
                alert('Error al cargar el voluntario');
                this.router.navigate(['/management/voluntarios']);
                this.isLoading = false;
            }
        });
    }

    patchForm(volunteer: Voluntario) {
        this.volunteerForm.patchValue({
            nombre: volunteer.nombre,
            apellido1: volunteer.apellido1,
            apellido2: volunteer.apellido2,
            mail: volunteer.mail,
            grado: volunteer.grado?.idGrado,
            estado: volunteer.estado,
            perfilUrl: volunteer.perfilUrl
        });

        // Checkboxes for TiposActividad
        if (volunteer.tiposActividad) {
            const selectedIds = volunteer.tiposActividad.map(t => t.idTipoActividad);
            // We will handle checkbox state in the template using this array or form control
            this.volunteerForm.get('tiposActividad')?.setValue(selectedIds);
        }
    }

    onCheckboxChange(e: any, id: number) {
        const tiposActividad: number[] = this.volunteerForm.get('tiposActividad')?.value || [];
        if (e.target.checked) {
            if (!tiposActividad.includes(id)) {
                tiposActividad.push(id);
            }
        } else {
            const index = tiposActividad.indexOf(id);
            if (index > -1) {
                tiposActividad.splice(index, 1);
            }
        }
        this.volunteerForm.get('tiposActividad')?.setValue(tiposActividad); // Trigger change detection
    }

    isChecked(id: number): boolean {
        const currentValues: number[] = this.volunteerForm.get('tiposActividad')?.value || [];
        return currentValues.includes(id);
    }

    isInvalid(fieldName: string): boolean {
        const field = this.volunteerForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.volunteerForm.invalid) {
            this.volunteerForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const formValue = this.volunteerForm.value;

        const updatedVolunteer: any = {
            nif: this.nif, // NIF cannot be changed easily as it is the ID
            nombre: formValue.nombre,
            apellido1: formValue.apellido1,
            apellido2: formValue.apellido2,
            mail: formValue.mail,
            estado: formValue.estado,
            perfilUrl: formValue.perfilUrl,
            grado: formValue.grado, // ID
            tiposActividad: formValue.tiposActividad // Array of IDs
        };

        this.volunteersService.update(updatedVolunteer).subscribe({
            next: () => {
                this.isSaving = false;
                // Navigate with success flag instead of alert
                this.router.navigate(['/management/voluntarios'], { queryParams: { success: 'true' } });
            },
            error: (err) => {
                console.error('Error updating volunteer', err);
                alert('Error al actualizar el voluntario');
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(['/management/voluntarios']);
    }
}
