import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitiesService } from '../../../services/entities.service';
import { Entidad } from '../../../models/entidad.model';
import { FilterSortComponent, FilterSection } from '../../../shared/components/filter-sort/filter-sort.component';
import { GenericListComponent, ColumnConfig } from '../../../shared/components/generic-list/generic-list.component';
import { GenericDetailComponent, DetailConfig } from '../../../shared/components/generic-detail/generic-detail.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { fadeIn, slideUp } from '../../../shared/animations/animations';

@Component({
    selector: 'app-management-entities',
    standalone: true,
    imports: [CommonModule, FilterSortComponent, GenericListComponent, GenericDetailComponent, LoadingSpinnerComponent],
    templateUrl: './entities.component.html',
    styleUrls: ['./entities.component.scss'],
    animations: [fadeIn, slideUp]
})
export class ManagementEntitiesComponent implements OnInit {

    entities: Entidad[] = [];
    displayEntities: Entidad[] = [];
    selectedEntity: Entidad | null = null;
    isLoading = true;

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
        listField: 'actividades',
        listLabel: 'Actividades',
        listDisplayField: 'nombre'
    };

    filterSections: FilterSection[] = [
        {
            key: 'activityStatus',
            label: 'Estado de Actividades',
            type: 'radio',
            options: [
                { label: 'Todas', value: 'all' },
                { label: 'Con Actividades', value: 'with_activities' },
                { label: 'Sin Actividades', value: 'without_activities' }
            ]
        }
    ];

    activeFilters: { [key: string]: any } = {
        activityStatus: 'all'
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
        this.isLoading = true;
        this.entitiesService.getAll().subscribe({
            next: (data) => {
                this.entities = data;
                this.displayEntities = [...this.entities];
                if (this.entities.length > 0) {
                    this.selectedEntity = this.entities[0];
                }
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading entities', err);
                this.isLoading = false;
            }
        });
    }

    selectEntity(entity: Entidad) {
        this.selectedEntity = entity;
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
        let temp = [...this.entities];

        // 0. Filtering
        const activityStatus = this.activeFilters['activityStatus'];
        if (activityStatus === 'with_activities') {
            temp = temp.filter(e => e.actividades && e.actividades.length > 0);
        } else if (activityStatus === 'without_activities') {
            temp = temp.filter(e => !e.actividades || e.actividades.length === 0);
        }

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
