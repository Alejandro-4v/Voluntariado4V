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
  @Input() buttonType: 'participar' | 'valorar' | 'informar' = 'participar';

  // New input for mode
  @Input() mode: 'student' | 'management' | 'preview' = 'student';

  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  // New outputs for management
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onAction() {
    this.action.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  getRatingStars(rating: number | null): any[] {
    if (!rating) return [];
    return Array(5).fill('').map((_, index) => ({
      filled: index < rating
    }));
  }

  getButtonLabel(): string {
    switch (this.buttonType) {
      case 'participar':
        return 'Participar';
      case 'valorar':
        return 'Valorar';
      case 'informar':
        return 'Informar de un problema';
      default:
        return 'Participar';
    }
  }
}

