import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { VolunteersService } from '../../../services/volunteers.service';
import { EntitiesService } from '../../../services/entities.service';
import { AdministratorService } from '../../../services/administrator.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { TipoActividad } from '../../../models/tipo-actividad.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { fadeIn, scaleIn } from '../../animations/animations';

@Component({
    selector: 'app-profile-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
    templateUrl: './profile-modal.component.html',
    animations: [fadeIn, scaleIn],
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content-wrapper {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      z-index: 1051;
      position: relative;
    }
    .profile-img-container {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      position: relative;
    }
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class ProfileModalComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    public authService = inject(AuthService); // Public for template access if needed
    private volunteerService = inject(VolunteersService);
    private entityService = inject(EntitiesService);
    private adminService = inject(AdministratorService);
    private typeService = inject(TipoActividadService);

    profileForm: FormGroup;
    currentUser: User | null = null;
    loading = true;
    saving = false;
    successMessage = '';
    errorMessage = '';
    tiposActividad: TipoActividad[] = [];

    constructor() {
        this.profileForm = this.fb.group({});
    }

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        if (!this.currentUser) {
            this.close.emit();
            return;
        }
        this.initFormBasedOnRole();
        this.loadData();
    }

    initFormBasedOnRole() {
        const role = this.currentUser?.role;
        if (role === 'volunteer') {
            this.profileForm = this.fb.group({
                mail: ['', [Validators.required, Validators.email]],
                perfilUrl: [''],
                tiposActividad: [[]]
            });
        } else if (role === 'entity') {
            this.profileForm = this.fb.group({
                contactMail: ['', [Validators.required, Validators.email]],
                perfilUrl: ['']
            });
        } else if (role === 'admin') {
            this.profileForm = this.fb.group({
                nombre: ['', Validators.required],
                apellido1: ['', Validators.required],
                apellido2: [''],
                perfilUrl: ['']
            });
        }
    }

    loadData() {
        this.loading = true;
        const role = this.currentUser?.role;

        // Load types for volunteer first if needed
        if (role === 'volunteer') {
            this.typeService.getAll().subscribe({
                next: (types) => {
                    this.tiposActividad = types;
                    this.loadUserData();
                },
                error: (err) => {
                    console.error('Error loading types', err);
                    this.loadUserData();
                }
            });
        } else {
            this.loadUserData();
        }
    }

    loadUserData() {
        const role = this.currentUser?.role;
        if (role === 'volunteer') {
            const details = this.currentUser?.details as any;
            const nif = this.currentUser?.nif || details?.nif;
            if (nif) {
                this.volunteerService.getById(nif).subscribe({
                    next: (vol) => {
                        const selectedTypes = vol.tiposActividad?.map(t => t.idTipoActividad) || [];
                        this.profileForm.patchValue({
                            mail: vol.mail,
                            perfilUrl: vol.perfilUrl,
                            tiposActividad: selectedTypes
                        });
                        this.loading = false;
                    },
                    error: this.handleLoadError.bind(this)
                });
            }
        } else if (role === 'entity') {
            const details = this.currentUser?.details as any;
            const id = this.currentUser?.id || details?.idEntidad;
            if (id) {
                this.entityService.getById(id).subscribe({
                    next: (ent) => {
                        this.profileForm.patchValue({
                            contactMail: ent.contactMail,
                            perfilUrl: ent.perfilUrl
                        });
                        this.loading = false;
                    },
                    error: this.handleLoadError.bind(this)
                });
            }
        } else if (role === 'admin') {
            const email = this.currentUser?.email;
            if (email) {
                this.adminService.getByLoginMail(email).subscribe({
                    next: (admin) => {
                        this.profileForm.patchValue({
                            nombre: admin.nombre,
                            apellido1: admin.apellido1,
                            apellido2: admin.apellido2,
                            perfilUrl: admin.perfilUrl
                        });
                        this.loading = false;
                    },
                    error: this.handleLoadError.bind(this)
                });
            }
        } else {
            this.loading = false;
        }
    }

    handleLoadError(err: any) {
        console.error('Error loading user data', err);
        this.errorMessage = 'Error al cargar los datos.';
        this.loading = false;
    }

    toggleType(typeId: number) {
        const currentTypes = this.profileForm.get('tiposActividad')?.value as number[];
        if (currentTypes.includes(typeId)) {
            this.profileForm.patchValue({ tiposActividad: currentTypes.filter(id => id !== typeId) });
        } else {
            this.profileForm.patchValue({ tiposActividad: [...currentTypes, typeId] });
        }
    }

    isChecked(typeId: number): boolean {
        const currentTypes = this.profileForm.get('tiposActividad')?.value as number[];
        return currentTypes ? currentTypes.includes(typeId) : false;
    }

    onBackdropClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.close.emit();
        }
    }

    onSubmit() {
        if (this.profileForm.invalid) return;

        this.saving = true;
        this.successMessage = '';
        this.errorMessage = '';
        const role = this.currentUser?.role;
        const formVal = this.profileForm.value;

        if (role === 'volunteer') {
            const details = this.currentUser?.details as any;
            const nif = this.currentUser?.nif || details?.nif;
            const updateData: any = {
                nif: nif,
                mail: formVal.mail,
                perfilUrl: formVal.perfilUrl,
                tiposActividad: formVal.tiposActividad
            };
            this.volunteerService.update(updateData).subscribe(this.getSaveObserver());
        } else if (role === 'entity') {
            const details = this.currentUser?.details as any;
            const id = this.currentUser?.id || details?.idEntidad;
            const updateData: any = {
                idEntidad: id,
                contactMail: formVal.contactMail,
                perfilUrl: formVal.perfilUrl
            };
            this.entityService.update(updateData).subscribe(this.getSaveObserver());
        } else if (role === 'admin') {
            const email = this.currentUser?.email;
            const updateData: any = {
                loginMail: email,
                nombre: formVal.nombre,
                apellido1: formVal.apellido1,
                apellido2: formVal.apellido2,
                perfilUrl: formVal.perfilUrl
            };
            this.adminService.update(updateData).subscribe(this.getSaveObserver());
        }
    }

    getSaveObserver() {
        return {
            next: (res: any) => {
                this.saving = false;
                this.successMessage = 'Los datos se han modificado correctamente';
            },
            error: (err: any) => {
                console.error('Error updating', err);
                this.saving = false;

                if (err.status === 409 || (err.error && err.error.error && err.error.error.includes('already exists'))) {
                    this.errorMessage = 'El correo electrónico ya está en uso.';
                } else {
                    this.errorMessage = 'Error al guardar los cambios.';
                }
            }
        };
    }
}
