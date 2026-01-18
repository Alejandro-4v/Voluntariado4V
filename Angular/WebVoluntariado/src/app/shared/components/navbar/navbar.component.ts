import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarMode, NavbarOption } from './navbar.interface';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @Input() mode: NavbarMode = 'white';
    @Input() options: NavbarOption[] = [];
    @Input() showLogout: boolean = true;

    @Output() logout = new EventEmitter<void>();

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
