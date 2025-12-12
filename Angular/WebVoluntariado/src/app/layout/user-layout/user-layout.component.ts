import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    template: `
    <div class="dashboard-wrapper min-vh-100 bg-light">
      <app-navbar [options]="currentOptions" mode="white" (logout)="handleLogout()"></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class UserLayoutComponent implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);

    currentOptions: NavbarOption[] = [
        { label: 'Mis actividades pasadas', path: '/student/actividades-pasadas' },
        { label: 'Contacto', path: '/student/contacto' },
        { label: 'Nuevas actividades', type: 'button', path: '/student/panel' }
    ];

    ngOnInit() {
        // Static options
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/iniciar-sesion']);
    }
}
