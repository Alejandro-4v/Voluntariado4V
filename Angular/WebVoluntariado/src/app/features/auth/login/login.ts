import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // ¡Importante RouterLink!
  templateUrl: './login.html',
  styleUrl: './login.scss' // Si tienes estilos específicos
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Formulario con validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login datos:', this.loginForm.value);
      
      // AQUÍ IRÍA LA LÓGICA DE LOGIN REAL
      // Ejemplo: this.authService.login(...).subscribe(...)
      
      // Simulación: Redirigir al home tras login exitoso
      // this.router.navigate(['/dashboard']); 
    } else {
      // Marcar campos como tocados para mostrar errores rojos
      this.loginForm.markAllAsTouched();
    }
  }
}