import { Routes } from '@angular/router';
import { ManagementLayoutComponent } from '../../layout/management-layout/management-layout.component';
import { ManagementHomeComponent } from './management-home/management-home.component';
import { ManagementActivitiesComponent } from './activities/activities.component';
import { NewActivityComponent } from './activities/new-activity/new-activity.component';
import { EditActivityComponent } from './activities/edit-activity/edit-activity.component';
import { EditVolunteerComponent } from './volunteers/edit-volunteer/edit-volunteer.component';
import { ManagementVolunteersComponent } from './volunteers/volunteers.component';
import { ManagementEntitiesComponent } from './entities/entities.component';

export const MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        component: ManagementLayoutComponent,
        children: [
            { path: 'panel', component: ManagementHomeComponent },
            { path: 'actividades', component: ManagementActivitiesComponent },
            { path: 'actividades/nueva', component: NewActivityComponent },
            { path: 'actividades/editar/:id', component: EditActivityComponent },
            { path: 'voluntarios', component: ManagementVolunteersComponent },
            { path: 'voluntarios/editar/:nif', component: EditVolunteerComponent },
            { path: 'entidades', component: ManagementEntitiesComponent },
            { path: '', redirectTo: 'panel', pathMatch: 'full' }
        ]
    }
];
