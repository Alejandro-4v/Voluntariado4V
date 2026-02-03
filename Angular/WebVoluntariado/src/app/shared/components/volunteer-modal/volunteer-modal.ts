import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VolunteersService } from '../../../services/volunteers.service';
import { GradoService } from '../../../services/grado.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { Grado } from '../../../models/grado.model';
import { TipoActividad } from '../../../models/tipo-actividad.model';

@Component({
    selector: 'app-volunteer-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './volunteer-modal.html',
    styleUrl: './volunteer-modal.scss'
})
export class VolunteerModalComponent implements OnInit {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private volunteersService = inject(VolunteersService);
    private gradoService = inject(GradoService);
    private tipoActividadService = inject(TipoActividadService);

    volunteerForm: FormGroup;
    grados: Grado[] = [];
    tiposActividad: TipoActividad[] = [];
    isLoading = false;
    errorMessage = '';

    constructor() {
        this.volunteerForm = this.fb.group({
            nif: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i)]],
            nombre: ['', Validators.required],
            apellido1: ['', Validators.required],
            apellido2: [''],
            mail: ['', [Validators.required, Validators.email]],
            gradoId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadInitialData();
    }

    loadInitialData(): void {
        this.gradoService.getAll().subscribe(data => this.grados = data);
        this.tipoActividadService.getAll().subscribe(data => this.tiposActividad = data);
    }

    onClose(): void {
        this.volunteerForm.reset();
        this.errorMessage = '';
        this.close.emit();
    }

    onSubmit(): void {
        if (this.volunteerForm.invalid) {
            this.volunteerForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const formValue = this.volunteerForm.value;
        const volunteerDTO: any = {
            nif: formValue.nif,
            nombre: formValue.nombre,
            apellido1: formValue.apellido1,
            apellido2: formValue.apellido2,
            mail: formValue.mail,
            password: '', // API now allows empty password for admin creation
            grado: Number(formValue.gradoId),
            tiposActividad: [],
            estado: 'A', // Default to Active for admin creation
            perfilUrl: `https://placehold.co/400/png?text=${formValue.nombre.charAt(0)}`,
            disponibilidades: []
        };

        this.volunteersService.create(volunteerDTO).subscribe({
            next: () => {
                this.isLoading = false;
                this.saved.emit();
                this.onClose();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.details || 'Error al crear el voluntario';
                console.error('Error creating volunteer:', err);
            }
        });
    }
}
