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
  
  
  layoutData: any = {
    title: 'Cargando...', 
    text1: '',
    subtitle: '',
    text2: ''
  };

  ngOnInit() {
    
    this.updateDataFromRoute();

    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateDataFromRoute();
    });
  }

  private updateDataFromRoute() {
    
    let currentRoute = this.router.routerState.root;
    
    
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    
    if (currentRoute.snapshot.data && Object.keys(currentRoute.snapshot.data).length > 0) {
      console.log('Datos encontrados:', currentRoute.snapshot.data); 
      this.layoutData = currentRoute.snapshot.data;
    }
  }
}