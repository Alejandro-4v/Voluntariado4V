import { Routes } from '@angular/router';
import { RegisterStudentComponent } from './features/auth/register-student/register-student';
import { LoginComponent } from './features/auth/login/login';
import { RegisterEntityComponent } from './features/auth/register-entity/register-entity';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { StatusMessageComponent } from './features/auth/status-message/status-message';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { 
          // DATOS DEL LAYOUT (Izquierda - Fondo Azul)
          title: 'Inicia sesión en', 
          subtitle: 'Cuatrovientos Voluntariado', 
          text1: 'Con tu pequeño gesto podremos hacer grandes historias que contar.',
          text2: 'Que nuestras anécdotas sean testimonio de que cada sonrisa cuenta'
        }
      },
      {
        path: 'register-student',
        component: RegisterStudentComponent,
        data: { 
          title: 'Inscríbete en',
          subtitle: 'Cuatrovientos Voluntariado',
          text1: 'Con tu pequeño gesto podremos hacer grandes historias que contar.',
          text2: 'Que nuestras anécdotas sean testimonio de que cada sonrisa cuenta'
        }
      },
      {
        path: 'register-entity',
        component: RegisterEntityComponent,
        data: { 
          title: '¿Quieres formar parte del cambio?',
          text1: 'Únete como entidad colaboradora y ayúdanos a crecer.' 
        }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'Recupera tu cuenta',
          subtitle: 'Cuatrovientos Voluntariado',
          text1: 'No te preocupes, nos pasa a todos.',
          text2: 'Introduce tu correo electrónico y te enviaremos las instrucciones para restablecerla.'
        }
      },
      {
        path: 'request-sent',
        component: StatusMessageComponent,
        data: {
          // DATOS DEL LAYOUT (Izquierda)
          title: '¡Gracias!',
          subtitle: 'Cuatrovientos Voluntariado',
          text1: 'Hemos recibido tu solicitud correctamente.',
          
          // --- DATOS PARA LA TARJETA (Parte Derecha) ---
          // Necesarios para que withComponentInputBinding los inyecte en los @Input
          cardTitle: '¡Solicitud enviada!',
          cardMessage: 'Pronto recibirás un correo electrónico a la dirección que nos has proporcionado con la resolución de tu petición.'
        }
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];