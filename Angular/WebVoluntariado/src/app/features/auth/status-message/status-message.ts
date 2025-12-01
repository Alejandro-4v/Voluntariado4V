import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-message.html',
  styleUrls: [] 
})
export class StatusMessageComponent {
  // CAMBIO IMPORTANTE: Usamos 'cardTitle' y 'cardMessage' para evitar conflictos
  @Input() cardTitle: string = '¡Solicitud enviada!';
  
  @Input() cardMessage: string = 'Pronto recibirás un correo electrónico a la dirección que nos has proporcionado con la resolución de tu petición.';
  
  @Input() showContactLink: boolean = true;
  @Input() backLink: string = '/login';
}