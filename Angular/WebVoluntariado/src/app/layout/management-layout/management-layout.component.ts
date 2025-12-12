import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';

@Component({
    selector: 'app-management-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    template: `
    <div class="management-wrapper min-vh-100 bg-light">
        <app-navbar [options]="navbarOptions" mode="blue" (logout)="handleLogout()"></app-navbar>
        <router-outlet></router-outlet>
    </div>
    `
})
export class ManagementLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    get navbarOptions(): NavbarOption[] {
        return [
            { label: 'Dashboard', path: '/management/panel' },
            { label: 'Actividades', path: '/management/actividades' },
            { label: 'Voluntarios', path: '/management/voluntarios' },
            { label: 'Entidades', path: '/management/entidades' },
            { label: 'Nueva actividad', type: 'button', path: '/management/actividades/nueva' }
        ];
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/iniciar-sesion']);
    }
}
