import { Grado } from './grado.model';
import { TipoActividad } from './tipo-actividad.model';
import { Ods } from './ods.model';

export interface Actividad {
    idActividad?: number;
    nombre: string;
    descripcion?: string;
    estado: string;
    convoca: EntidadActividad;
    inicio: string;
    fin: string;
    imagenUrl?: string;
    grado: Grado;
    tiposActividad: TipoActividad[];
    ods: Ods[];
    voluntarios: VoluntarioActividad[];
    // Future fields
    lugar: string;
    // Future fields or UI specific
    plazas?: number;
    valoracion?: number;
}

export interface EntidadActividad {
    idEntidad?: number;
    cif?: string;
    nombre: string;
    nombreResponsable: string;
    apellidosResponsable: string;
    contactMail: string;
    perfilUrl?: string;
}

export interface VoluntarioActividad {
    nif: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    grado: Grado;
    mail: string;
    perfilUrl?: string;
}
