import { Routes } from '@angular/router'; // turbo
import { ManagementLayoutComponent } from '../../layout/management-layout/management-layout.component';
import { ManagementHomeComponent } from './management-home/management-home.component';
import { ManagementActivitiesComponent } from './activities/activities.component';
import { ManagementVolunteersComponent } from './volunteers/volunteers.component';
import { ManagementEntitiesComponent } from './entities/entities.component';

export const MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        component: ManagementLayoutComponent,
        children: [
            { path: 'panel', component: ManagementHomeComponent },
            { path: 'actividades', component: ManagementActivitiesComponent },
            { path: 'actividades/nueva', component: ManagementHomeComponent },
            { path: 'voluntarios', component: ManagementVolunteersComponent },
            { path: 'entidades', component: ManagementEntitiesComponent },
            { path: '', redirectTo: 'panel', pathMatch: 'full' }
        ]
    }
];
