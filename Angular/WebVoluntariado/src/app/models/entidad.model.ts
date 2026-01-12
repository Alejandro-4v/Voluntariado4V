import { Actividad } from './actividad.model';

export interface Entidad {
    idEntidad?: number;
    cif?: string;
    nombre: string;
    nombreResponsable: string;
    apellidosResponsable: string;
    fechaRegistro: string;
    contactMail: string;
    loginMail?: string;
    passwordHash?: string;
    perfilUrl?: string;
    actividades?: Actividad[];
}
