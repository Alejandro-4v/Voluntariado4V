import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card-component.html',
  styleUrl: './activity-card-component.scss',
})
export class ActivityCardComponent {
  @Input() name!: string;
  @Input() type!: string;
  @Input() slots!: number;
  @Input() filled!: number;
  @Input() image?: string;

  @Output() cardClick = new EventEmitter<void>();

  getProgressPercentage(): number {
    return this.slots > 0 ? Math.round((this.filled / this.slots) * 100) : 0;
  }

  onCardClick() {
    this.cardClick.emit();
  }
}
