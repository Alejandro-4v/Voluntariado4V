import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NavbarOption } from '../../shared/components/navbar/navbar.interface';
import { AppCarrouselComponent } from '../../shared/components/app-carrousel/app-carrousel';
import { ActivitiesService } from '../../services/activities.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent, AppCarrouselComponent],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
    private router = inject(Router);
    private activitiesService = inject(ActivitiesService);

    recentActivities: any[] = [];

    stats = [
        { value: '150+', label: 'Voluntarios Activos', icon: 'bi-people' },
        { value: '500+', label: 'Actividades Realizadas', icon: 'bi-check-circle' },
        { value: '2000+', label: 'Horas Contribuidas', icon: 'bi-clock' },
        { value: '20+', label: 'Entidades Colaboradoras', icon: 'bi-building' }
    ];

    benefits = [
        { title: 'Desarrollo Personal', description: 'Adquiere nuevas habilidades y competencias transversales.', icon: '🎓' },
        { title: 'Impacto Social', description: 'Contribuye directamente a mejorar tu comunidad.', icon: '❤️' },
        { title: 'Networking', description: 'Conoce a personas con tus mismos intereses y valores.', icon: '🤝' },
        { title: 'Reconocimiento', description: 'Obtén créditos y certificados por tu participación.', icon: '🏆' }
    ];

    testimonials = [
        { name: 'Ana García', role: 'Estudiante 2º DAM', text: 'Una experiencia increíble que me ha permitido crecer como persona y profesional.', avatar: 'assets/avatars/ana.jpg' },
        { name: 'Mikel Oroz', role: 'Estudiante 1º SMR', text: 'He conocido gente maravillosa y he aprendido mucho más que en clase.', avatar: 'assets/avatars/mikel.jpg' }
    ];

    navbarOptions: NavbarOption[] = [
        { label: 'Iniciar Sesión', type: 'button', path: '/auth/iniciar-sesion' }
    ];

    ngOnInit() {
        this.activitiesService.getAll().subscribe(data => {
            
            this.recentActivities = data.filter(a => a.estado === 'A').slice(0, 6);
        });
    }

    handleLogin() {
        this.router.navigate(['/auth/iniciar-sesion']);
    }
}
