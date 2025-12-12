import { Routes } from '@angular/router'; // turbo
import { ManagementLayoutComponent } from '../../layout/management-layout/management-layout.component';
import { ManagementHomeComponent } from './management-home/management-home.component';

export const MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        component: ManagementLayoutComponent,
        children: [
            { path: 'panel', component: ManagementHomeComponent },
            { path: 'actividades', component: ManagementHomeComponent },
            { path: 'actividades/nueva', component: ManagementHomeComponent },
            { path: 'voluntarios', component: ManagementHomeComponent },
            { path: 'entidades', component: ManagementHomeComponent },
            { path: '', redirectTo: 'panel', pathMatch: 'full' }
        ]
    }
];
