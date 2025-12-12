import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'proposal-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './proposal-card.component.html',
    styleUrl: './proposal-card.component.scss',
})
export class ProposalCardComponent {
    @Input() name!: string;
    @Input() slots!: number;
    @Input() filled!: number;

    getProgressPercentage(): number {
        return this.slots > 0 ? Math.round((this.filled / this.slots) * 100) : 0;
    }
}
