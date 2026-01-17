import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'entity-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './entity-card.component.html',
    styleUrl: './entity-card.component.scss',
})
export class EntityCardComponent {
    @Input() name!: string;
    @Input() type!: string;
    @Input() image?: string;

    @Output() cardClick = new EventEmitter<void>();

    onCardClick() {
        this.cardClick.emit();
    }
}
