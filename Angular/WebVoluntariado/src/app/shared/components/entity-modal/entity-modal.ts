
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from '../app-carrousel/app-carrousel';

@Component({
    selector: 'app-entity-modal',
    standalone: true,
    imports: [CommonModule, AppCarrouselComponent],
    templateUrl: './entity-modal.html',
    styleUrls: ['./entity-modal.scss']
})
export class EntityModalComponent {
    @Input() isOpen = false;
    @Input() entity: any = null;
    @Input() activities: any[] = [];

    @Output() close = new EventEmitter<void>();
    @Output() activityClick = new EventEmitter<any>();

    onClose() {
        this.close.emit();
    }

    onActivityClick(activity: any) {
        this.activityClick.emit(activity);
    }
}
