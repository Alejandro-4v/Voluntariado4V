import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent implements OnInit {
  private router = inject(Router);
  
  // Inicializamos con valores por defecto para evitar errores
  layoutData: any = {
    title: 'Cargando...', 
    text1: '',
    subtitle: '',
    text2: ''
  };

  ngOnInit() {
    // 1. Carga inmediata al iniciar el componente
    this.updateDataFromRoute();

    // 2. Suscripción a cambios de navegación (para cuando cambias entre login y registro)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateDataFromRoute();
    });
  }

  private updateDataFromRoute() {
    // Truco: Usar routerState.root busca desde la raíz global, no desde este componente
    let currentRoute = this.router.routerState.root;
    
    // Bajamos hasta encontrar la última ruta hija activa (Login, Register, etc.)
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    // Si encontramos datos en esa ruta, actualizamos la variable
    if (currentRoute.snapshot.data && Object.keys(currentRoute.snapshot.data).length > 0) {
      console.log('Datos encontrados:', currentRoute.snapshot.data); // Mira la consola del navegador (F12)
      this.layoutData = currentRoute.snapshot.data;
    }
  }
}