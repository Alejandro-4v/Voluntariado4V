import { Routes } from '@angular/router'; // turbo
import { LoginComponent } from './login/login';
import { RegisterStudentComponent } from './register-student/register-student';
import { RegisterEntityComponent } from './register-entity/register-entity';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { StatusMessageComponent } from './status-message/status-message';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layout';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'iniciar-sesion',
                component: LoginComponent,
                data: {
                    title: 'Inicia sesión en',
                    subtitle: 'Cuatrovientos Voluntariado',
                    text1: 'Con tu pequeño gesto podremos hacer grandes historias que contar.',
                    text2: 'Que nuestras anécdotas sean testimonio de que cada sonrisa cuenta'
                }
            },
            {
                path: 'registro-alumno',
                component: RegisterStudentComponent,
                data: {
                    title: 'Inscríbete en',
                    subtitle: 'Cuatrovientos Voluntariado',
                    text1: 'Con tu pequeño gesto podremos hacer grandes historias que contar.',
                    text2: 'Que nuestras anécdotas sean testimonio de que cada sonrisa cuenta'
                }
            },
            {
                path: 'registro-entidad',
                component: RegisterEntityComponent,
                data: {
                    title: '¿Quieres formar parte del cambio?',
                    text1: 'Únete como entidad colaboradora y ayúdanos a crecer.'
                }
            },
            {
                path: 'recuperar-contrasena',
                component: ForgotPasswordComponent,
                data: {
                    title: 'Recupera tu cuenta',
                    subtitle: 'Cuatrovientos Voluntariado',
                    text1: 'No te preocupes, nos pasa a todos.',
                    text2: 'Introduce tu correo electrónico y te enviaremos las instrucciones para restablecerla.'
                }
            },
            {
                path: 'solicitud-enviada',
                component: StatusMessageComponent,
                data: {
                    title: '¡Gracias!',
                    subtitle: 'Cuatrovientos Voluntariado',
                    text1: 'Hemos recibido tu solicitud correctamente.',
                    cardTitle: '¡Solicitud enviada!',
                    cardMessage: 'Pronto recibirás un correo electrónico a la dirección que nos has proporcionado con la resolución de tu petición.'
                }
            },
            { path: '', redirectTo: 'iniciar-sesion', pathMatch: 'full' }
        ]
    }
];
