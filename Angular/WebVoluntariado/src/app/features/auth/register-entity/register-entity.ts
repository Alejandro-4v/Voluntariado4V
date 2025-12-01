import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-register-entity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-entity.html',
  styleUrls: ['./register-entity.scss']
})
export class RegisterEntityComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router); // Inyectar Router

  entityForm = this.fb.group({
    orgName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(500)]]
  });

  onSubmit() {
    if (this.entityForm.valid) {
      console.log('REGISTRO ENTIDAD ENVIADO:', this.entityForm.value);
      // REDIRECCIÓN
      this.router.navigate(['/request-sent']);
    } else {
      this.entityForm.markAllAsTouched();
    }
  }
}