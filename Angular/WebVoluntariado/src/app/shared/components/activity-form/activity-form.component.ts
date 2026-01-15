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
    selectedImage: string | ArrayBuffer | null = null;
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
                types: this.initialData.tiposActividad?.map((t: any) => t.idTipoActividad) || []
            });
            if (this.initialData.image || this.initialData.imagenUrl) {
                this.selectedImage = this.initialData.image || this.initialData.imagenUrl;
            }
        }
    }

    onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.selectedImage = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById('activityImage') as HTMLElement;
        fileInput.click();
    }

    onSubmit(): void {
        if (this.activityForm.valid) {
            this.save.emit({ ...this.activityForm.value, image: this.selectedImage });
        } else {
            this.activityForm.markAllAsTouched();
        }
    }



    onPreview(): void {
        this.previewAction.emit({ ...this.activityForm.value, image: this.selectedImage });
    }

    get title(): string {
        return this.mode === 'create' ? 'Nueva Actividad' : 'Editar Actividad';
    }

    get submitButtonLabel(): string {
        return this.mode === 'create' ? 'Crear nueva Actividad' : 'Guardar nueva Actividad'; // Or 'Guardar cambios'
    }
}
