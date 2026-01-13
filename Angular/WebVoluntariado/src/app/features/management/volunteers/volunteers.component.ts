import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteersService } from '../../../services/volunteers.service';
import { TipoActividadService } from '../../../services/tipo-actividad.service';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../../services/excel.service';
import { Voluntario } from '../../../models/voluntario.model';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';
import { GenericListComponent, ColumnConfig } from '../../../shared/components/generic-list/generic-list.component';
import { GenericDetailComponent, DetailConfig } from '../../../shared/components/generic-detail/generic-detail.component';

@Component({
    selector: 'app-management-volunteers',
    standalone: true,
    imports: [CommonModule, FormsModule, FilterSortComponent, GenericListComponent, GenericDetailComponent],
    templateUrl: './volunteers.component.html',
    styleUrls: ['./volunteers.component.scss']
})
export class ManagementVolunteersComponent implements OnInit {

    volunteers: Voluntario[] = [];
    displayVolunteers: Voluntario[] = [];
    selectedVolunteer: Voluntario | null = null;

    filterBy: string = 'all';
    sortBy: string = '';
    groupBy: string = '';

    private volunteersService = inject(VolunteersService);
    private excelService = inject(ExcelService);

    // Configuration for Generic List
    listColumns: ColumnConfig[] = [
        { header: 'NIF', field: 'nif', className: 'col-1' },
        { header: 'Nombre', field: 'nombre', className: 'col-1' },
        { header: 'Apellido 1', field: 'apellido1', className: 'col-1' },
        { header: 'Apellido 2', field: 'apellido2', className: 'col-1' },
        { header: 'Grado', field: 'grado.descripcion', className: 'col-2' },
        { header: 'Email', field: 'mail', className: 'col-3 text-truncate' },
        { header: 'Estado', field: 'estado', className: 'col-1' }
    ];

    // Configuration for Generic Detail
    detailConfig: DetailConfig = {
        imageField: 'perfilUrl',
        titleField: 'nombre',
        subtitles: [
            { label: 'NIF', field: 'nif' },
            { label: 'Apellido 1', field: 'apellido1' },
            { label: 'Apellido 2', field: 'apellido2' },
            { label: 'Grado', field: 'grado.descripcion' },
            { label: 'Email', field: 'mail' },
            { label: 'Estado', field: 'estado' }
        ],
        listField: 'tiposActividad',
        listLabel: 'Intereses',
        listDisplayField: 'descripcion'
    };

    filterOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Activos', value: 'activo' },
        { label: 'Inactivos', value: 'inactivo' }
    ];

    sortOptions = [
        { label: 'Nombre', value: 'nombre' },
        { label: 'Apellido', value: 'apellido1' }
    ];

    groupOptions = [
        { label: 'Grado', value: 'grado.descripcion' },
        { label: 'Ninguno', value: '' }
    ];

    private tipoActividadService = inject(TipoActividadService);

    types: any[] = [];
    selectedInterests: number[] = [];
    selectedDays: number[] = [];

    daysOfWeek = [
        { id: 1, name: 'Lunes' },
        { id: 2, name: 'Martes' },
        { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' },
        { id: 5, name: 'Viernes' },
        { id: 6, name: 'Sábado' },
        { id: 7, name: 'Domingo' }
    ];

    ngOnInit() {
        this.volunteersService.getAll().subscribe(data => {
            this.volunteers = data;
            this.displayVolunteers = [...this.volunteers];
            if (this.volunteers.length > 0) {
                this.selectedVolunteer = this.volunteers[0];
            }
        });

        this.tipoActividadService.getAll().subscribe(data => {
            this.types = data;
        });
    }

    selectVolunteer(volunteer: Voluntario) {
        this.selectedVolunteer = volunteer;
    }

    onFilterBy(criteria: string) {
        this.filterBy = criteria;
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

    toggleInterest(id: number) {
        if (this.selectedInterests.includes(id)) {
            this.selectedInterests = this.selectedInterests.filter(i => i !== id);
        } else {
            this.selectedInterests.push(id);
        }
        this.applyFilters();
    }

    toggleDay(id: number) {
        if (this.selectedDays.includes(id)) {
            this.selectedDays = this.selectedDays.filter(d => d !== id);
        } else {
            this.selectedDays.push(id);
        }
        this.applyFilters();
    }

    clearFilters() {
        this.selectedInterests = [];
        this.selectedDays = [];
        this.filterBy = 'all';
        this.applyFilters();
    }

    getInterestName(id: number): string {
        return this.types.find(t => t.idTipoActividad === id)?.nombre || 'Desconocido';
    }

    getDayName(id: number): string {
        return this.daysOfWeek.find(d => d.id === id)?.name || 'Desconocido';
    }

    applyFilters() {
        let temp = [...this.volunteers];

        // 0. Filtering (Status)
        if (this.filterBy !== 'all') {
            temp = temp.filter(v => v.estado?.toLowerCase() === this.filterBy.toLowerCase());
        }

        // Filter by Interest (OR logic: has ANY of the selected interests)
        if (this.selectedInterests.length > 0) {
            temp = temp.filter(v => v.tiposActividad?.some(t => t.idTipoActividad !== undefined && this.selectedInterests.includes(t.idTipoActividad)));
        }

        // Filter by Availability (OR logic: available on ANY of the selected days)
        if (this.selectedDays.length > 0) {
            temp = temp.filter(v => v.disponibilidades?.some(d => {
                const id = d.diaSemana?.idDia;
                return id !== undefined && this.selectedDays.includes(id);
            }));
        }

        temp.sort((a, b) => {
            // 1. Primary Sort: Grouping
            if (this.groupBy === 'grado.descripcion') {
                const groupA = a.grado?.descripcion || '';
                const groupB = b.grado?.descripcion || '';
                const groupCompare = groupA.localeCompare(groupB);
                if (groupCompare !== 0) return groupCompare;
            }

            // 2. Secondary Sort: Sorting
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
            'Intereses': v.tiposActividad?.map(t => t.nombre).join(', ') || ''
        }));

        this.excelService.exportAsExcelFile(dataToExport, 'voluntarios');
    }
}
