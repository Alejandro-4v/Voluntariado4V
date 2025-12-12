import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from '../../../shared/components/app-carrousel/app-carrousel';

@Component({
    selector: 'app-management-activities',
    standalone: true,
    imports: [CommonModule, AppCarrouselComponent],
    templateUrl: './activities.component.html'
})
export class ManagementActivitiesComponent {

    upcomingActivities = [
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 1, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 3, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 2, image: '', customBackground: '#fff' }
    ];

    pastActivities = [
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 5, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 5, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 5, image: '', customBackground: '#fff' }
    ];

    pendingActivities = [
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff' }
    ];

    proposals = [
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff', showIcon: true },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff', showIcon: true },
        { name: 'Nombre de la actividad', type: 'Entidad', slots: 5, filled: 0, image: '', customBackground: '#fff', showIcon: true }
    ];

    openActivityModal(activity: any) {
        console.log('Open modal for:', activity);
    }
}
