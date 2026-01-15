import { Grado } from './grado.model';
import { TipoActividad } from './tipo-actividad.model';
import { Disponibilidad } from './disponibilidad.model';

export interface Voluntario {
    nif: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    grado: Grado;
    mail: string;
    estado: string;
    perfilUrl?: string;
    disponibilidades?: Disponibilidad[];
    tiposActividad?: TipoActividad[];
}
