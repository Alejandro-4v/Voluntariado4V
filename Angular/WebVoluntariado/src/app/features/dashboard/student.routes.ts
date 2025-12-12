import { Routes } from '@angular/router'; // turbo
import { DashboardComponent } from './dashboard';
import { PastActivitiesComponent } from './past-activities/past-activities';
import { ContactComponent } from './contact/contact';
import { UserLayoutComponent } from '../../layout/user-layout/user-layout.component';

export const STUDENT_ROUTES: Routes = [
    {
        path: 'panel',
        component: UserLayoutComponent,
        children: [
            { path: '', component: DashboardComponent }
        ]
    },
    {
        path: 'actividades-pasadas',
        component: UserLayoutComponent,
        children: [
            { path: '', component: PastActivitiesComponent }
        ]
    },
    {
        path: 'contacto',
        component: UserLayoutComponent,
        children: [
            { path: '', component: ContactComponent }
        ]
    }
];
