import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-student.html',
  styleUrls: ['./register-student.scss']
})
export class RegisterStudentComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router); // Inyectar Router

  studentForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required]
  });

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Registro Alumno:', this.studentForm.value);
      // REDIRECCIÓN A LA PANTALLA DE ÉXITO
      this.router.navigate(['/request-sent']);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}