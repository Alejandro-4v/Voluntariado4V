import { Entidad } from './entidad.model';
import { Grado } from './grado.model';
import { TipoActividad } from './tipo-actividad.model';
import { Ods } from './ods.model';
import { Voluntario } from './voluntario.model';

export interface Actividad {
    idActividad?: number;
    nombre: string;
    descripcion?: string;
    estado: string;
    convoca: Entidad;
    inicio: string;
    fin: string;
    imagenUrl?: string;
    plazasTotales?: number;
    grado: Grado;
    tiposActividad: TipoActividad[];
    ods: Ods[];
    voluntarios: Voluntario[];
}
