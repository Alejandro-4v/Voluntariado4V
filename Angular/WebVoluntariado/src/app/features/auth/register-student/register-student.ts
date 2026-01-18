import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; 

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-student.html',
  styleUrls: ['./register-student.scss']
})
export class RegisterStudentComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router); 

  studentForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required]
  });

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Registro Alumno:', this.studentForm.value);
      
      this.router.navigate(['/auth/solicitud-enviada']);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}