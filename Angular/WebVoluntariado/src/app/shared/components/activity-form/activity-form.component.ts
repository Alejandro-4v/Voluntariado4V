import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-activity-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './activity-form.component.html',
    styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() initialData: any = null; // Replace 'any' with an interface if available
    @Output() save = new EventEmitter<any>();
    @Output() draft = new EventEmitter<any>();
    @Output() previewAction = new EventEmitter<any>();

    activityForm: FormGroup;
    selectedImage: string | ArrayBuffer | null = null;
    entities = ['Cuatrovientos Voluntariado', 'Cruz Roja', 'Banco de Alimentos'];

    constructor(private fb: FormBuilder) {
        this.activityForm = this.fb.group({
            name: ['', Validators.required],
            slots: ['', Validators.required],
            description: ['', Validators.required],
            entity: ['', Validators.required],
            date: ['', Validators.required],
            location: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.initialData) {
            this.activityForm.patchValue(this.initialData);
            if (this.initialData.image) {
                this.selectedImage = this.initialData.image;
            }
        }

        // Select default entity for create mode if needed
        if (this.mode === 'create' && !this.activityForm.get('entity')?.value) {
            // Optional: Setup default
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

    onSaveDraft(): void {
        this.draft.emit({ ...this.activityForm.value, image: this.selectedImage });
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
