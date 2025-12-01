import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: [] // Usamos estilos globales
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  submitted = false;
  successMessage = false;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotForm.valid) {
      // Aquí iría la lógica para conectar con tu backend
      console.log('Enviando correo a:', this.forgotForm.value.email);
      
      // Simulamos éxito para mostrar el mensaje
      this.successMessage = true; 
    }
  }
}