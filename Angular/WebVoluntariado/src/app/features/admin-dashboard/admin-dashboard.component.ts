import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    get navbarOptions(): NavbarOption[] {
        return [
            { label: 'Dashboard', path: '/admin-dashboard' },
            { label: 'Actividades', path: '/admin/activities' },
            { label: 'Voluntarios', path: '/admin/volunteers' },
            { label: 'Entidades', path: '/admin/entities' },
            { label: 'Nueva actividad', type: 'button', path: '/admin/activities/new' }
        ];
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
