import { Component, Input } from '@angular/core';
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
}
