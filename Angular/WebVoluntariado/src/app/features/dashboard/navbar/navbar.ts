import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Detectar cambios de ruta para actualizar el navbar
  }

  isOnPastActivities(): boolean {
    return this.router.url.includes('/past-activities');
  }

  isOnContact(): boolean {
    return this.router.url.includes('/contact');
  }

  getMainButtonText(): string {
    if (this.isOnPastActivities()) {
      return 'Mis actividades pasadas';
    } else if (this.isOnContact()) {
      return 'Contacto';
    }
    return 'Nuevas actividades';
  }

  getSecondaryLinkPath(): string {
    if (this.isOnPastActivities()) {
      return '/dashboard';
    } else if (this.isOnContact()) {
      return '/dashboard';
    }
    return '/past-activities';
  }

  getSecondaryLinkText(): string {
    if (this.isOnPastActivities()) {
      return 'Nuevas actividades';
    } else if (this.isOnContact()) {
      return 'Nuevas actividades';
    }
    return 'Mis actividades pasadas';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
