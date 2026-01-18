import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fadeIn } from '../../animations/animations';
import { UploadService } from '../../../services/upload.service';

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
    @Input() initialData: any = null;
    @Input() isLoading: boolean = false;
    @Output() save = new EventEmitter<any>();

    @Output() previewAction = new EventEmitter<any>();


    activityForm: FormGroup;
    entities = ['Cuatrovientos Voluntariado', 'Cruz Roja', 'Banco de Alimentos'];

    @Input() odsList: any[] = [];
    @Input() typesList: any[] = [];
    @Input() entitiesList: any[] = [];

    @Input() gradosList: any[] = [];

    @Input() userRole: string = '';
    @Input() currentEntityId: any = null;



    private uploadService = inject(UploadService);
    isUploading = false;
    imagePreview: string | null = null;

    constructor(private fb: FormBuilder) {
        this.activityForm = this.fb.group({
            name: ['', Validators.required],
            slots: ['', Validators.required],
            description: ['', Validators.required],
            entity: ['', Validators.required],
            grado: ['', Validators.required],
            date: ['', Validators.required],
            startTime: ['', Validators.required],
            endDate: ['', Validators.required],
            endTime: ['', Validators.required],
            location: ['', Validators.required],
            status: ['P', Validators.required],
            image: [''],
            ods: [[]],
            types: [[]]
        }, { validators: this.dateRangeValidator });
    }

    dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
        const date = group.get('date')?.value;
        const startTime = group.get('startTime')?.value;
        const endDate = group.get('endDate')?.value;
        const endTime = group.get('endTime')?.value;

        if (date && startTime && endDate && endTime) {
            const start = new Date(`${date}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);

            if (start >= end) {
                return { dateRangeInvalid: true };
            }
        }
        return null;
    }

    ngOnInit(): void {

        if (this.userRole === 'entity' && this.currentEntityId) {
            this.activityForm.patchValue({
                entity: this.currentEntityId,
                status: 'P'
            });
            this.activityForm.get('entity')?.disable();
            this.activityForm.get('status')?.disable();
        }

        if (this.initialData) {
            const start = this.initialData.inicio ? new Date(this.initialData.inicio) : null;
            const end = this.initialData.fin ? new Date(this.initialData.fin) : null;

            this.activityForm.patchValue({
                ...this.initialData,
                entity: this.initialData.convoca?.idEntidad || this.initialData.entity || (this.userRole === 'entity' ? this.currentEntityId : ''),
                grado: this.initialData.grado?.idGrado || this.initialData.grado,
                ods: this.initialData.ods?.map((o: any) => o.idOds) || [],
                types: this.initialData.tiposActividad?.map((t: any) => t.idTipoActividad) || [],
                image: this.initialData.image || this.initialData.imagenUrl,
                date: start ? start.toISOString().split('T')[0] : '',
                startTime: start ? start.toTimeString().slice(0, 5) : '',
                endDate: end ? end.toISOString().split('T')[0] : '',
                endTime: end ? end.toTimeString().slice(0, 5) : '',
                status: this.initialData.estado || 'P'
            });

            if (this.userRole === 'entity') {
                this.activityForm.get('entity')?.disable();
                this.activityForm.get('status')?.disable();
            }
        }

        if (this.activityForm.get('image')?.value) {
            this.imagePreview = this.activityForm.get('image')?.value;
        }
    }

    onSubmit(): void {
        console.log('ActivityFormComponent: onSubmit called');
        console.log('Form Valid:', this.activityForm.valid);
        console.log('Form Value:', this.activityForm.value);
        console.log('Form Errors:', this.activityForm.errors);

        if (this.activityForm.valid) {
            console.log('Emitting save event');
            this.save.emit(this.activityForm.getRawValue());
        } else {
            console.log('Form invalid, marking as touched');
            this.activityForm.markAllAsTouched();
        }
    }

    onPreview(): void {
        this.previewAction.emit(this.activityForm.getRawValue());
    }

    get title(): string {
        return this.mode === 'create' ? 'Nueva Actividad' : 'Editar Actividad';
    }

    get submitButtonLabel(): string {
        return this.mode === 'create' ? 'Crear nueva Actividad' : 'Editar Actividad';
    }


    onFileSelected(event: any) {
        console.log('onFileSelected triggered', event);
        let file: File | undefined;
        if (event.target?.files && event.target.files.length > 0) {
            file = event.target.files[0]; // From input click
            console.log('File selected from input:', file?.name);
        } else if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            file = event.dataTransfer.files[0]; // From drag & drop
            console.log('File selected from drag & drop:', file?.name);
        }

        if (file) {
            this.isUploading = true;
            this.uploadService.uploadImage(file).subscribe({
                next: (response) => {
                    console.log('Upload success:', response);
                    this.activityForm.patchValue({ image: response.url });
                    this.imagePreview = response.url;
                    this.isUploading = false;
                },
                error: (err) => {
                    console.error('Upload failed - Full Error Object:', err);
                    alert('Error al subir la imagen: ' + (err.error?.error || err.message || 'Unknown error'));
                    this.isUploading = false;
                }
            });
        } else {
            console.warn('No file found in event');
        }
    }
}
