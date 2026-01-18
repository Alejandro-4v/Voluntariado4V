import { Grado } from './grado.model';
import { TipoActividad } from './tipo-actividad.model';
import { Ods } from './ods.model';

export interface Entidad {
    idEntidad?: number;
    cif?: string;
    nombre: string;
    nombreResponsable: string;
    apellidosResponsable: string;
    fechaRegistro: string;
    contactMail: string;
    loginMail?: string;
    perfilUrl?: string;
    actividades?: ActividadEntidad[];
}

export interface ActividadEntidad {
    idActividad?: number;
    nombre: string;
    descripcion?: string;
    estado: string;
    inicio: string;
    fin: string;
    imagenUrl?: string;
    grado: Grado;
    tiposActividad: TipoActividad[];
    ods: Ods[];
    
}
