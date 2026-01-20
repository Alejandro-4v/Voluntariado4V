import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailField {
    label: string;
    field: string;
    pipe?: 'date';
}

export interface DetailConfig {
    imageField: string;
    titleField: string;
    subtitles: DetailField[];
    listField?: string;
    listLabel?: string;
    listDisplayField?: string;
    emailField?: string;
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
    @Input() showEdit: boolean = false;
    @Output() edit = new EventEmitter<void>();

    onEdit() {
        this.edit.emit();
    }

    getFieldValue(item: any, field: string): any {
        return field.split('.').reduce((obj, key) => obj?.[key], item);
    }

    onContact() {
        if (!this.item || !this.config || !this.config.emailField) {
            console.warn('Cannot send email: configuration or item missing.');
            return;
        }

        const email = this.getFieldValue(this.item, this.config.emailField);
        if (email) {
            window.location.href = `mailto:${email}`;
        } else {
            console.warn('No email found for field:', this.config.emailField);
        }
    }
}
