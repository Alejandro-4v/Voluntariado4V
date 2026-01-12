import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteersService, Volunteer } from '../../../services/volunteers.service';
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

    volunteers: Volunteer[] = [];
    displayVolunteers: Volunteer[] = [];
    selectedVolunteer: Volunteer | null = null;

    sortBy: string = '';
    groupBy: string = '';

    private volunteersService = inject(VolunteersService);

    // Configuration for Generic List
    listColumns: ColumnConfig[] = [
        { header: 'Nombre voluntario', field: 'name' },
        { header: 'Fecha de nacimiento', field: 'birthDate', pipe: 'date' },
        { header: 'Grupo', field: 'group' }
    ];

    // Configuration for Generic Detail
    detailConfig: DetailConfig = {
        imageField: 'image',
        titleField: 'name',
        subtitles: [
            { label: 'Fecha de nacimiento', field: 'birthDate', pipe: 'date' },
            { label: 'Grupo', field: 'group' },
            { label: 'Curso actual', field: 'course' }
        ],
        listField: 'interests',
        listLabel: 'Intereses'
    };

    sortOptions = [
        { label: 'Nombre', value: 'name' },
        { label: 'Fecha de nacimiento', value: 'date' }
    ];

    groupOptions = [
        { label: 'Grupo', value: 'group' },
        { label: 'Ninguno', value: '' }
    ];

    ngOnInit() {
        this.volunteersService.getVolunteers().subscribe(data => {
            this.volunteers = data;
            this.displayVolunteers = [...this.volunteers];
            if (this.volunteers.length > 0) {
                this.selectedVolunteer = this.volunteers[0];
            }
        });
    }

    selectVolunteer(volunteer: Volunteer) {
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
            if (this.groupBy === 'group') {
                const groupCompare = (a.group || '').localeCompare(b.group || '');
                if (groupCompare !== 0) return groupCompare;
            }

            // 2. Secondary Sort: Sorting
            if (this.sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (this.sortBy === 'date') {
                return new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();
            }

            return 0;
        });

        this.displayVolunteers = temp;
    }
}
