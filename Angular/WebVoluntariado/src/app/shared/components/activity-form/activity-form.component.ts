import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fadeIn } from '../../animations/animations';

@Component({
    selector: 'app-activity-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './activity-form.component.html',
    styleUrls: ['./activity-form.component.scss'],
    animations: [fadeIn]
})
export class ActivityFormComponent implements OnInit {
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() initialData: any = null; // Replace 'any' with an interface if available
    @Output() save = new EventEmitter<any>();

    @Output() previewAction = new EventEmitter<any>();

    activityForm: FormGroup;
    entities = ['Cuatrovientos Voluntariado', 'Cruz Roja', 'Banco de Alimentos'];

    @Input() odsList: any[] = [];
    @Input() typesList: any[] = [];
    @Input() entitiesList: any[] = [];
    @Input() gradosList: any[] = [];

    // Removed service injections

    constructor(private fb: FormBuilder) {
        this.activityForm = this.fb.group({
            name: ['', Validators.required],
            slots: ['', Validators.required],
            description: ['', Validators.required],
            entity: ['', Validators.required],
            grado: ['', Validators.required],
            date: ['', Validators.required],
            location: ['', Validators.required],
            image: [''], // URL input
            ods: [[]],
            types: [[]]
        });
    }

    ngOnInit(): void {
        // Data loading moved to parent component

        if (this.initialData) {
            this.activityForm.patchValue({
                ...this.initialData,
                entity: this.initialData.convoca?.idEntidad || this.initialData.entity, // Handle object or string
                grado: this.initialData.grado?.idGrado || this.initialData.grado,
                ods: this.initialData.ods?.map((o: any) => o.idOds) || [],
                types: this.initialData.tiposActividad?.map((t: any) => t.idTipoActividad) || [],
                image: this.initialData.image || this.initialData.imagenUrl
            });
        }
    }

    onSubmit(): void {
        console.log('ActivityFormComponent: onSubmit called');
        console.log('Form Valid:', this.activityForm.valid);
        console.log('Form Value:', this.activityForm.value);
        console.log('Form Errors:', this.activityForm.errors);

        if (this.activityForm.valid) {
            console.log('Emitting save event');
            this.save.emit(this.activityForm.value);
        } else {
            console.log('Form invalid, marking as touched');
            this.activityForm.markAllAsTouched();
        }
    }

    onPreview(): void {
        this.previewAction.emit(this.activityForm.value);
    }

    get title(): string {
        return this.mode === 'create' ? 'Nueva Actividad' : 'Editar Actividad';
    }

    get submitButtonLabel(): string {
        return this.mode === 'create' ? 'Crear nueva Actividad' : 'Guardar nueva Actividad'; // Or 'Guardar cambios'
    }
}
