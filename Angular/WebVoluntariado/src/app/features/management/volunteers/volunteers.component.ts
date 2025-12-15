import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolunteersService, Volunteer } from '../../../services/volunteers.service';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';
import { VolunteerListComponent } from './components/volunteer-list/volunteer-list.component';
import { VolunteerDetailComponent } from './components/volunteer-detail/volunteer-detail.component';

@Component({
    selector: 'app-management-volunteers',
    standalone: true,
    imports: [CommonModule, FilterSortComponent, VolunteerListComponent, VolunteerDetailComponent],
    templateUrl: './volunteers.component.html',
    styleUrls: ['./volunteers.component.scss']
})
export class ManagementVolunteersComponent implements OnInit {

    volunteers: Volunteer[] = [];
    displayVolunteers: Volunteer[] = [];
    selectedVolunteer: Volunteer | null = null;

    sortBy: string = '';
    groupBy: string = '';

    sortOptions = [
        { label: 'Nombre', value: 'name' },
        { label: 'Fecha de nacimiento', value: 'date' }
    ];

    groupOptions = [
        { label: 'Grupo', value: 'group' },
        { label: 'Ninguno', value: '' }
    ];

    private volunteersService = inject(VolunteersService);

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

        // Sorting
        if (this.sortBy === 'name') {
            temp.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sortBy === 'date') {
            temp.sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
        }

        // Grouping
        if (this.groupBy === 'group') {
            temp.sort((a, b) => a.group.localeCompare(b.group));
        }

        this.displayVolunteers = temp;
    }
}
