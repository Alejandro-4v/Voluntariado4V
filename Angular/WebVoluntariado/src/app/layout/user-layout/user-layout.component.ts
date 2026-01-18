import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
    template: `
    <div class="dashboard-wrapper min-vh-100 bg-light d-flex flex-column">
      <app-navbar [options]="currentOptions" mode="white" (logout)="handleLogout()"></app-navbar>
      <div class="flex-grow-1">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
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
        
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/iniciar-sesion']);
    }
}
