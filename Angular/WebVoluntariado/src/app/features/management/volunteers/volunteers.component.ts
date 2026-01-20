import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VolunteersService } from '../../../services/volunteers.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../../services/excel.service';
import { Voluntario } from '../../../models/voluntario.model';
import { FilterSortComponent, FilterSection } from '../../../shared/components/filter-sort/filter-sort.component';
import { GenericListComponent, ColumnConfig } from '../../../shared/components/generic-list/generic-list.component';
import { GenericDetailComponent, DetailConfig } from '../../../shared/components/generic-detail/generic-detail.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp } from '../../../shared/animations/animations';

@Component({
    selector: 'app-management-volunteers',
    standalone: true,
    imports: [CommonModule, FormsModule, FilterSortComponent, GenericListComponent, GenericDetailComponent, LoadingSpinnerComponent],
    templateUrl: './volunteers.component.html',
    styleUrls: ['./volunteers.component.scss'],
    animations: [fadeIn, slideUp]
})
export class ManagementVolunteersComponent implements OnInit {

    volunteers: Voluntario[] = [];
    displayVolunteers: Voluntario[] = [];
    selectedVolunteer: Voluntario | null = null;
    isLoading = true;

    sortBy: string = '';
    groupBy: string = '';

    private volunteersService = inject(VolunteersService);
    private excelService = inject(ExcelService);
    private tipoActividadService = inject(TipoActividadService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    successMessage: string = '';

    listColumns: ColumnConfig[] = [
        { header: 'Nombre Completo', field: 'nombreCompleto', className: 'col-3' },
        { header: 'Email', field: 'mail', className: 'col-4' },
        { header: 'Estado', field: 'estadoLabel', className: 'col-2' }
    ];


    detailConfig: DetailConfig = {
        imageField: 'perfilUrl',
        titleField: 'nombre',
        subtitles: [
            { label: 'NIF', field: 'nif' },
            { label: 'Apellido 1', field: 'apellido1' },
            { label: 'Apellido 2', field: 'apellido2' },
            { label: 'Grado', field: 'grado.descripcion' },
            { label: 'Email', field: 'mail' },
            { label: 'Estado', field: 'estadoLabel' }
        ],
        listField: 'tiposActividad',
        listLabel: 'Intereses',
        listDisplayField: 'descripcion',
        emailField: 'mail'
    };

    sortOptions = [
        { label: 'Nombre', value: 'nombre' },
        { label: 'Apellido', value: 'apellido1' }
    ];

    groupOptions = [
        { label: 'Grado', value: 'grado.descripcion' },
        { label: 'Ninguno', value: '' }
    ];

    types: any[] = [];

    daysOfWeek = [
        { id: 1, name: 'Lunes' },
        { id: 2, name: 'Martes' },
        { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' },
        { id: 5, name: 'Viernes' },
        { id: 6, name: 'Sábado' },
        { id: 7, name: 'Domingo' }
    ];

    filterSections: FilterSection[] = [];
    activeFilters: { [key: string]: any } = {};

    ngOnInit() {
        this.updateFilterSections();
        this.isLoading = true;

        this.route.queryParams.subscribe((params: any) => {
            if (params['success'] === 'true') {
                this.successMessage = 'Usuario editado correctamente';
                // Remove the query param to prevent showing message on refresh if desired, 
                // but for now keeping it simple or clearing it after timeout
                setTimeout(() => {
                    this.successMessage = '';
                    // Optionally navigate to replace url
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { success: null },
                        queryParamsHandling: 'merge',
                        replaceUrl: true
                    });
                }, 3000);
            }
        });

        this.volunteersService.getAll().subscribe({
            next: (data) => {
                console.log('Volunteers data received:', data);
                console.log('First volunteer:', data[0]);
                console.log('First volunteer grado:', data[0]?.grado);
                console.log('First volunteer tiposActividad:', data[0]?.tiposActividad);


                this.volunteers = data.map(v => ({
                    ...v,
                    nombreCompleto: `${v.nombre} ${v.apellido1}${v.apellido2 ? ' ' + v.apellido2 : ''}`,
                    estadoLabel: this.getEstadoLabel(v.estado)
                }));
                this.displayVolunteers = [...this.volunteers];
                if (this.volunteers.length > 0) {
                    this.selectedVolunteer = this.volunteers[0];
                }
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading volunteers', err);
                this.isLoading = false;
            }
        });

        this.loadTypes();
    }

    loadTypes() {
        this.tipoActividadService.getAll().subscribe(types => {
            this.types = types;
            this.updateFilterSections();
        });
    }

    updateFilterSections() {
        this.filterSections = [
            {
                key: 'status',
                label: 'Estado',
                type: 'radio',
                options: [
                    { label: 'Todos', value: 'all' },
                    { label: 'Activos', value: 'activo' },
                    { label: 'Inactivos', value: 'inactivo' }
                ]
            },
            {
                key: 'interests',
                label: 'Intereses',
                type: 'checkbox',
                options: this.types.map(t => ({ label: t.descripcion, value: t.idTipoActividad }))
            },
            {
                key: 'availability',
                label: 'Disponibilidad',
                type: 'checkbox',
                options: this.daysOfWeek.map(d => ({ label: d.name, value: d.id }))
            }
        ];


        if (!this.activeFilters['status']) this.activeFilters['status'] = 'all';
        if (!this.activeFilters['interests']) this.activeFilters['interests'] = [];
        if (!this.activeFilters['availability']) this.activeFilters['availability'] = [];
    }

    selectVolunteer(volunteer: Voluntario) {
        this.selectedVolunteer = volunteer;
    }

    onFiltersChange(newFilters: { [key: string]: any }) {
        this.activeFilters = newFilters;
        this.applyFilters();
    }

    onSortBy(criteria: string) {
        this.sortBy = criteria;
        this.applyFilters();
    }

    onGroupBy(criteria: string) {
        this.groupBy = criteria;
        this.applyFilters();
    }

    applyFilters() {
        let temp = [...this.volunteers];


        const status = this.activeFilters['status'];
        if (status && status !== 'all') {
            temp = temp.filter(v => v.estado?.toLowerCase() === status);
        }


        const interests = this.activeFilters['interests'];
        if (interests && interests.length > 0) {
            temp = temp.filter(v => v.tiposActividad?.some(t => t.idTipoActividad !== undefined && interests.includes(t.idTipoActividad)));
        }


        const days = this.activeFilters['availability'];
        if (days && days.length > 0) {
            temp = temp.filter(v => v.disponibilidades?.some(d => {
                const id = d.diaSemana?.idDia;
                return id !== undefined && days.includes(id);
            }));
        }

        temp.sort((a, b) => {

            if (this.groupBy === 'grado.descripcion') {
                const groupA = a.grado?.descripcion || '';
                const groupB = b.grado?.descripcion || '';
                const groupCompare = groupA.localeCompare(groupB);
                if (groupCompare !== 0) return groupCompare;
            }


            if (this.sortBy === 'nombre') {
                return a.nombre.localeCompare(b.nombre);
            } else if (this.sortBy === 'apellido1') {
                return a.apellido1.localeCompare(b.apellido1);
            }

            return 0;
        });

        this.displayVolunteers = temp;
    }

    exportToExcel() {
        const dataToExport = this.displayVolunteers.map(v => ({
            'NIF': v.nif,
            'Nombre': v.nombre,
            'Apellido 1': v.apellido1,
            'Apellido 2': v.apellido2,
            'Email': v.mail,
            'Grado': v.grado?.descripcion || '',
            'Estado': v.estado,
            'Intereses': v.tiposActividad?.map(t => t.descripcion).join(', ') || ''
        }));

        this.excelService.exportAsExcelFile(dataToExport, 'voluntarios');
    }

    onEdit(volunteer: Voluntario) {
        this.router.navigate(['/management/voluntarios/editar', volunteer.nif]);
    }

    getEstadoLabel(estado: string): string {
        const estadoMap: { [key: string]: string } = {
            'P': 'Pendiente',
            'A': 'Activo',
            'I': 'Inactivo',
            'R': 'Rechazado'
        };
        return estadoMap[estado] || estado;
    }
}
