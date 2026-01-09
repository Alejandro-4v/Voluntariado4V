import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';

@Component({
    selector: 'app-new-activity',
    standalone: true,
    imports: [CommonModule, ActivityFormComponent],
    templateUrl: './new-activity.component.html',
    styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent {

    onSave(activityData: any): void {
        console.log('Create Activity', activityData);
        // Call service to create
    }

    onDraft(activityData: any): void {
        console.log('Save Draft', activityData);
    }

    onPreview(activityData: any): void {
        console.log('Preview Activity', activityData);
    }
}
