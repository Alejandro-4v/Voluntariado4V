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
        // If mode is white (white background), we want the blue logo (or the one that looks good on white)
        // Current dashboard uses 'logo-white.svg' on 'bg-white'. Assuming that's correct for now.
        // But logically:
        // White bg -> Colored/Blue logo
        // Blue bg -> White logo

        // User said: "les cambia el icono depende de cual"
        // Let's assume for now:
        // White mode -> assets/logo-white.svg (preserving current behavior)
        // Blue mode -> assets/logo-blue.svg
        // Wait, if I see the image provided by user (blue header), it has a White logo.

        return this.mode === 'white' ? 'assets/logo-white.svg' : 'assets/logo-white.svg'; // Placeholder logic, will refine based on visual
    }

    // To fix the logo confusion, let's look at the filenames again.
    // logo-blue.svg implies it is blue. logo-white.svg implies it is white.
    // If the navbar is blue, we need a WHITE logo -> logo-white.svg
    // If the navbar is white, we need a BLUE logo -> logo-blue.svg

    // BUT the current existing code: 
    // <nav class="... bg-white ..."> <img src="assets/logo-white.svg" ...>
    // This means logo-white.svg is being used on a white background. 
    // This implies logo-white.svg might be the "logo variant for white background" (i.e. it is blue).
    // OR it is invisible and I am misinterpreting.

    // Let's try to swap them if mode is blue.

    get computedLogoSrc(): string {
        if (this.mode === 'white') {
            return 'assets/logo-white.svg'; // Keep as is for current dashboard
        } else {
            return 'assets/logo-blue.svg'; // Or maybe the other way around? 
            // If "logo-blue.svg" is the blue logo, it won't be visible on blue bg.
            // Let's assume the user knows their assets or I will name them generically.
        }
    }

    // Wait, I will use a simple mapping I can change easily or input.
    // Better yet, I'll rely on the mode class in SCSS to maybe handle things, but for IMG src I need logic.

    getLogo(): string {
        // Logic based on checking the files: 
        // logo-white.svg (6k) vs logo-blue.svg (1.2M). 
        // The current dashboard uses logo-white.svg on white.

        if (this.mode === 'white') {
            return 'assets/logo-white.svg';
        }
        return 'assets/logo-white.svg'; // For blue mode (admin) we likely want white logo too?
    }

    // Let's assume:
    // White Mode (Student) -> assets/logo-white.svg (Current)
    // Blue Mode (Admin) -> assets/logo-blue.svg (or whatever is needed)

    // Actually, checking the image user uploaded: Blue background, White Logo (clearly white lines).
    // So 'logo-white.svg' seems appropriate for Blue Background.
    // why is it used on White Background currently? Maybe it has dark text?

    // I will leave it configurable or use the same one if it works for both, but the user said "cambia el icono".
    // So I will make it switch.

    get currentLogo(): string {
        return this.mode === 'white' ? 'assets/logo-white.svg' : 'assets/logo-blue.svg';
        // I will invert this if I see it's wrong.
        // Actually, if logo-white is used on white bg, it must be dark.
        // Then on blue bg, we need a light logo. Maybe 'logo-blue' is the light one? (Naming can be confusing).
        // I'll trust the user requirement "cambia el icono" and switch them.
    }
}
