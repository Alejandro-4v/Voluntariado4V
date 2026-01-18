import { DiaSemana } from './dia-semana.model';

export interface Disponibilidad {
    diaSemana: DiaSemana;
    horaInicio: string; 
    horaFin: string; 
}
