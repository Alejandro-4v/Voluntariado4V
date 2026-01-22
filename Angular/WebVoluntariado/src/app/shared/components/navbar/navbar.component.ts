import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService, User } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { NavbarMode, NavbarOption } from './navbar.interface';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, AsyncPipe],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @Input() mode: NavbarMode = 'white';
    @Input() options: NavbarOption[] = [];
    @Input() showLogout: boolean = true;

    @Output() logout = new EventEmitter<void>();
    @Output() profileClick = new EventEmitter<void>();

    private authService = inject(AuthService);
    user$ = this.authService.getCurrentUser$();

    getProfileUrl(user: User): string | undefined {
        console.log('Navbar checking user:', user); // DEBUG
        if (!user) return undefined;

        // Check for property directly on User object (flat structure from login)
        if (user.perfilUrl) {
            console.log('Found user.perfilUrl:', user.perfilUrl); // DEBUG
            return user.perfilUrl;
        }
        if (user.perfil_url) {
            console.log('Found user.perfil_url:', user.perfil_url); // DEBUG
            return user.perfil_url;
        }

        // Check details object if it exists (for backward compatibility or other endpoints)
        if (user.details) {
            if (user.details.perfilUrl) return user.details.perfilUrl;
            // Check for potential snake_case property from backend
            const detailsAny = user.details as any;
            if (detailsAny.perfil_url) return detailsAny.perfil_url;
        }

        return undefined;
    }

    get logoSrc(): string {
        return this.mode === 'white' ? 'assets/logo-white.svg' : 'assets/logo-white.svg';
    }




    get computedLogoSrc(): string {
        if (this.mode === 'white') {
            return 'assets/logo-white.svg';
        } else {
            return 'assets/logo-blue.svg';
        }
    }


    getLogo(): string {

        if (this.mode === 'white') {
            return 'assets/logo-white.svg';
        }
        return 'assets/logo-white.svg';
    }




    get currentLogo(): string {
        return this.mode === 'white' ? 'assets/logo-white.svg' : 'assets/logo-blue.svg';
    }
}
