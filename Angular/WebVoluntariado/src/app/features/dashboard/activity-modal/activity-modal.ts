import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-modal.html',
  styleUrl: './activity-modal.scss'
})
export class ActivityModalComponent {
  @Input() isOpen = false;
  @Input() activity: any = null;
  @Input() buttonType: 'participar' | 'valorar' = 'participar';
  
  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onAction() {
    this.action.emit();
  }

  getRatingStars(rating: number | null): any[] {
    if (!rating) return [];
    return Array(5).fill('').map((_, index) => ({
      filled: index < rating
    }));
  }
}
