import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailField {
    label: string;
    field: string;
    pipe?: 'date';
}

export interface DetailConfig {
    imageField: string;
    titleField: string;
    subtitles: DetailField[]; // Use for rows (label above, value below) or key-value pairs
    listField?: string;
    listLabel?: string;
}

@Component({
    selector: 'app-generic-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './generic-detail.component.html',
    styleUrls: ['./generic-detail.component.scss']
})
export class GenericDetailComponent {
    @Input() item: any | null = null;
    @Input() config: DetailConfig | null = null;
}
