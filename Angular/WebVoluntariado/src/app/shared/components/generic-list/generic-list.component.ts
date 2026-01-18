import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnConfig {
    header: string;
    field: string;
    pipe?: 'date';
    className?: string; 
}

@Component({
    selector: 'app-generic-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './generic-list.component.html',
    styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent {
    @Input() items: any[] = [];
    @Input() columns: ColumnConfig[] = [];
    @Input() selectedId: number | string | null = null;
    @Input() keyField: string = 'id';
    @Output() select = new EventEmitter<any>();

    onSelect(item: any) {
        this.select.emit(item);
    }

    getFieldValue(item: any, field: string): any {
        return field.split('.').reduce((obj, key) => obj?.[key], item);
    }
}
