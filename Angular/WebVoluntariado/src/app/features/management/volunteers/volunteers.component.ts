import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteersService } from '../../../services/volunteers.service';
import { Voluntario } from '../../../models/voluntario.model';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';
import { GenericListComponent, ColumnConfig } from '../../../shared/components/generic-list/generic-list.component';
import { GenericDetailComponent, DetailConfig } from '../../../shared/components/generic-detail/generic-detail.component';

@Component({
    selector: 'app-management-volunteers',
    standalone: true,
    imports: [CommonModule, FilterSortComponent, GenericListComponent, GenericDetailComponent],
    templateUrl: './volunteers.component.html',
    styleUrls: ['./volunteers.component.scss']
})
export class ManagementVolunteersComponent implements OnInit {

    volunteers: Voluntario[] = [];
    displayVolunteers: Voluntario[] = [];
    selectedVolunteer: Voluntario | null = null;

    sortBy: string = '';
    groupBy: string = '';

    private volunteersService = inject(VolunteersService);

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
        listLabel: 'Intereses'
    };

    sortOptions = [
        { label: 'Nombre', value: 'nombre' },
        { label: 'Apellido', value: 'apellido1' }
    ];

    groupOptions = [
        { label: 'Grado', value: 'grado.descripcion' },
        { label: 'Ninguno', value: '' }
    ];

    ngOnInit() {
        this.volunteersService.getAll().subscribe(data => {
            this.volunteers = data;
            this.displayVolunteers = [...this.volunteers];
            if (this.volunteers.length > 0) {
                this.selectedVolunteer = this.volunteers[0];
            }
        });
    }

    selectVolunteer(volunteer: Voluntario) {
        this.selectedVolunteer = volunteer;
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
}
