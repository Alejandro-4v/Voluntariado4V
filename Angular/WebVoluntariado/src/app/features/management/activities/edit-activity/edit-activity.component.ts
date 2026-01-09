import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActivityFormComponent } from '../../../../shared/components/activity-form/activity-form.component';

@Component({
    selector: 'app-edit-activity',
    standalone: true,
    imports: [CommonModule, ActivityFormComponent],
    templateUrl: './edit-activity.component.html',
    styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {
    activityData: any = null;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Simulate fetching data based on ID
        // const id = this.route.snapshot.paramMap.get('id');

        // Mock data for demonstration
        this.activityData = {
            name: 'Torneo de Futbol Solidario',
            slots: '15 personas',
            description: 'Un torneo para recaudar fondos...',
            entity: 'Cuatrovientos Voluntariado',
            date: '2023-10-15T10:00',
            location: 'Polideportivo Municipal',
            image: null // Or a URL string
        };
    }

    onSave(updatedData: any): void {
        console.log('Update Activity', updatedData);
        // Call service to update
    }

    onDraft(data: any): void {
        console.log('Update Draft', data);
    }

    onPreview(data: any): void {
        console.log('Preview Update', data);
    }
}
