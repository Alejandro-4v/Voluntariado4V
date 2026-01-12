import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesService } from '../../../services/entities.service';
import { Entidad } from '../../../models/entidad.model';
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

    entities: Entidad[] = [];
    displayEntities: Entidad[] = [];
    selectedEntity: Entidad | null = null;

    sortBy: string = '';
    groupBy: string = '';

    private entitiesService = inject(EntitiesService);

    // Configuration for Generic List
    listColumns: ColumnConfig[] = [
        { header: 'Nombre Entidad', field: 'nombre' },
        { header: 'Fecha de Inscripción', field: 'fechaRegistro', pipe: 'date' },
        { header: 'Responsable', field: 'nombreResponsable' }
    ];

    // Configuration for Generic Detail
    detailConfig: DetailConfig = {
        imageField: 'perfilUrl',
        titleField: 'nombre',
        subtitles: [
            { label: 'Fecha de inscripción', field: 'fechaRegistro', pipe: 'date' },
            { label: 'Responsable', field: 'nombreResponsable' },
            { label: 'Email', field: 'contactMail' }
        ],
        listField: 'actividades', // This might need adjustment in GenericDetailComponent to handle objects
        listLabel: 'Actividades',
        listDisplayField: 'nombre'
    };

    sortOptions = [
        { label: 'Nombre', value: 'nombre' },
        { label: 'Fecha de inscripción', value: 'fechaRegistro' }
    ];

    groupOptions = [
        { label: 'Responsable', value: 'nombreResponsable' },
        { label: 'Ninguno', value: '' }
    ];

    ngOnInit() {
        this.entitiesService.getAll().subscribe(data => {
            this.entities = data;
            this.displayEntities = [...this.entities];
            if (this.entities.length > 0) {
                this.selectedEntity = this.entities[0];
            }
        });
    }

    selectEntity(entity: Entidad) {
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
            if (this.groupBy === 'nombreResponsable') {
                const groupCompare = (a.nombreResponsable || '').localeCompare(b.nombreResponsable || '');
                if (groupCompare !== 0) return groupCompare;
            }

            // 2. Secondary Sort: Sorting
            if (this.sortBy === 'nombre') {
                return a.nombre.localeCompare(b.nombre);
            } else if (this.sortBy === 'fechaRegistro') {
                return new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime();
            }

            return 0;
        });

        this.displayEntities = temp;
    }
}
