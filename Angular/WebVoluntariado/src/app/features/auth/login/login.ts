import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { fadeIn, slideUp } from '../../../shared/animations/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  animations: [fadeIn, slideUp]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage: string | null = null;

  // Formulario con validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    userType: ['voluntario', [Validators.required]]
  });

  onSubmit() {
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password, userType } = this.loginForm.value;

      // Cast userType to the specific union type expected by login
      const type = (userType as 'voluntario' | 'entidad' | 'administrador') || 'voluntario';

      this.authService.login(email || '', password || '', type).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('✓ Login exitoso:', response.user);
            // Redirigir al dashboard según el rol
            if (response.user?.role === 'admin') {
              this.router.navigate(['/management/dashboard']); // Example route
            } else if (response.user?.role === 'entity') {
              this.router.navigate(['/management/dashboard']); // Example route
            } else {
              this.router.navigate(['/student/panel']);
            }
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al iniciar sesión';
          console.error('✗ Error de login:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}