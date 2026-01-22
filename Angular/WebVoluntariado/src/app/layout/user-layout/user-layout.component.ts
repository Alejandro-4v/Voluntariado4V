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
      <app-navbar [options]="currentOptions" mode="white" (logout)="handleLogout()" (profileClick)="handleProfileClick()"></app-navbar>
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

  handleProfileClick() {
    // Modal handled by NavbarComponent internal logic via event binding if necessary, 
    // but here Navbar emits event. We need to tell Navbar to show modal? 
    // Wait, Navbar has showProfileModal. If we listen to (profileClick), we can just toggle it IN Navbar?
    // Actually, look at Navbar HTML: (click)="profileClick.emit()". 
    // If I want Navbar to handle it internally, I should change Navbar specific logic OR Layout listens and toggles?
    // BETTER: Navbar handles it internally. Revert Layout to do nothing or remove the event binding in layout HTML.
    // However, looking at Navbar template (not visible here but usually), profile click emits.
    // Let's check NavbarComponent.ts again. It has @Output() profileClick.
    // If I want the modal to be inside Navbar, Navbar should handle the click itself 
    // AND optionally emit.
    // Let's update NavbarComponent to handle the click locally usually.
    // For now, let's make layout handlers do nothing or log.
    console.log('Profile clicked');
  }
}
