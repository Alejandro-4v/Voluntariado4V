import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesService, Entity } from '../../../services/entities.service';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';
import { EntityListComponent } from './components/entity-list/entity-list.component';
import { EntityDetailComponent } from './components/entity-detail/entity-detail.component';

@Component({
    selector: 'app-management-entities',
    standalone: true,
    imports: [CommonModule, FilterSortComponent, EntityListComponent, EntityDetailComponent],
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class ManagementEntitiesComponent implements OnInit {

    entities: Entity[] = [];
    displayEntities: Entity[] = [];
    selectedEntity: Entity | null = null;

    sortBy: string = '';
    groupBy: string = '';

    sortOptions = [
        { label: 'Nombre', value: 'name' },
        { label: 'Fecha de inscripción', value: 'date' }
    ];

    groupOptions = [
        { label: 'Responsable', value: 'responsible' },
        { label: 'Ninguno', value: '' }
    ];

    private entitiesService = inject(EntitiesService);

    ngOnInit() {
        this.entitiesService.getEntities().subscribe(data => {
            this.entities = data;
            this.displayEntities = [...this.entities];
            if (this.entities.length > 0) {
                this.selectedEntity = this.entities[0];
            }
        });
    }

    selectEntity(entity: Entity) {
        this.selectedEntity = entity;
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
        let temp = [...this.entities];

        // Sorting
        if (this.sortBy === 'name') {
            temp.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.sortBy === 'date') {
            temp.sort((a, b) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime());
        }

        // Grouping
        if (this.groupBy === 'responsible') {
            temp.sort((a, b) => a.responsible.localeCompare(b.responsible));
        }

        this.displayEntities = temp;
    }
}
