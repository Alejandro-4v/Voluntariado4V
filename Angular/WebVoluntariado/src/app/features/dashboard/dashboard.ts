import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCarrouselComponent } from './app-carrousel/app-carrousel';
import { Navbar } from './navbar/navbar';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent, AppCarrouselComponent, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;

  entitiesActivities = [
    {
      entity: 'Amabir',
      activities: [
        { name: 'Actividad de jardín', type: 'Jardinería', slots: 5, filled: 1, image: '' },
        { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 3, image: '' },
        { name: 'Paseo acompañado', type: 'Acompañamiento', slots: 5, filled: 0, image: '' },
        { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 2, image: '' }
      ]
    },
    {
      entity: 'Solera Asistencial',
      activities: [
        { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 1, image: '' },
        { name: 'Compañía en residencia', type: 'Acompañamiento', slots: 5, filled: 4, image: '' },
        { name: 'Apoyo administrativo', type: 'Administrativo', slots: 5, filled: 2, image: '' }
      ]
    }
  ];

  proposals = [
    { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 2, image: '', customBackground: '#fff', showIcon: true },
    { name: 'Taller de tecnología', type: 'Tecnología', slots: 8, filled: 5, image: '', customBackground: '#fff', showIcon: true },
    { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 7, image: '', customBackground: '#fff', showIcon: true }
  ];

  otherEntities = [
    { name: 'Cáritas Diocesana', type: 'ONG Social', slots: 0, filled: 0, image: 'assets/caritas.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
    { name: 'Cruz Roja', type: 'Organización Humanitaria', slots: 0, filled: 0, image: 'assets/cruzroja.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
    { name: 'Fundación Española', type: 'Fundación', slots: 0, filled: 0, image: 'assets/fundacion.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' }
  ];

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }



  scrollCarousel(event: Event, direction: 'left' | 'right') {
    event.preventDefault();

    const track = (event.target as HTMLElement)
      .closest('.d-flex')
      ?.querySelector('.carousel-track') as HTMLElement;

    if (track) {
      const cardWidth = track.clientWidth / 3; // EXACTAMENTE 3 TARJETAS VISIBLES
      track.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  }
}
