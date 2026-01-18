import { Routes } from '@angular/router'; 
import { DashboardComponent } from './dashboard';
import { PastActivitiesComponent } from './past-activities/past-activities';
import { ContactComponent } from './contact/contact';

export const STUDENT_ROUTES: Routes = [
    { path: 'panel', component: DashboardComponent },
    { path: 'actividades-pasadas', component: PastActivitiesComponent },
    { path: 'contacto', component: ContactComponent },
    { path: '', redirectTo: 'panel', pathMatch: 'full' }
];
