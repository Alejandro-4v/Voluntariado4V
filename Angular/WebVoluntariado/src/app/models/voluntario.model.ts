import { Grado } from './grado.model';
import { TipoActividad } from './tipo-actividad.model';

export interface Voluntario {
    nif: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    grado: Grado;
    mail: string;
    passwordHash: string;
    estado: string;
    perfilUrl?: string;
    disponibilidades?: any[]; // TODO: Define Disponibilidad model
    tiposActividad?: TipoActividad[];
}
