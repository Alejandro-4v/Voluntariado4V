import { DiaSemana } from './dia-semana.model';

export interface Disponibilidad {
    diaSemana: DiaSemana;
    horaInicio: string; // Time string like "09:00:00"
    horaFin: string; // Time string like "13:00:00"
}
