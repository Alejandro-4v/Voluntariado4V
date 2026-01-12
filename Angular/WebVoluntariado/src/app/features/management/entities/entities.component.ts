import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesService, Entity } from '../../../services/entities.service';
import { FilterSortComponent } from '../../../shared/components/filter-sort/filter-sort.component';
import { GenericListComponent, ColumnConfig } from '../../../shared/components/generic-list/generic-list.component';
import { GenericDetailComponent, DetailConfig } from '../../../shared/components/generic-detail/generic-detail.component';

@Component({
    selector: 'app-management-entities',
    standalone: true,
    imports: [CommonModule, FilterSortComponent, GenericListComponent, GenericDetailComponent],
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss']
})
export class ManagementEntitiesComponent implements OnInit {

    entities: Entity[] = [];
    displayEntities: Entity[] = [];
    selectedEntity: Entity | null = null;

    sortBy: string = '';
    groupBy: string = '';

    private entitiesService = inject(EntitiesService);

    // Configuration for Generic List
    listColumns: ColumnConfig[] = [
        { header: 'Nombre Entidad', field: 'name' },
        { header: 'Fecha de Inscripción', field: 'registrationDate', pipe: 'date' },
        { header: 'Responsable', field: 'responsible' }
    ];

    // Configuration for Generic Detail
    detailConfig: DetailConfig = {
        imageField: 'image',
        titleField: 'name',
        subtitles: [
            { label: 'Fecha de inscripción', field: 'registrationDate', pipe: 'date' },
            { label: 'Responsable', field: 'responsible' }
        ],
        listField: 'types',
        listLabel: 'Tipos de actividades'
    };

    sortOptions = [
        { label: 'Nombre', value: 'name' },
        { label: 'Fecha de inscripción', value: 'date' }
    ];

    groupOptions = [
        { label: 'Responsable', value: 'responsible' },
        { label: 'Ninguno', value: '' }
    ];

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

        temp.sort((a, b) => {
            // 1. Primary Sort: Grouping
            if (this.groupBy === 'responsible') {
                const groupCompare = (a.responsible || '').localeCompare(b.responsible || '');
                if (groupCompare !== 0) return groupCompare;
            }

            // 2. Secondary Sort: Sorting
            if (this.sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (this.sortBy === 'date') {
                return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
            }

            return 0;
        });

        this.displayEntities = temp;
    }
}
