import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Voluntario } from '../models/voluntario.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class VolunteersService {

    private apiUrl = `${API_URL}/voluntario`;

    // MOCK DATA
    private mockVolunteers: any[] = [
        {
            nif: '12345678A',
            nombre: 'Juan',
            apellido1: 'Pérez',
            apellido2: 'García',
            grado: { descripcion: '2º DAM' },
            mail: 'juan.perez@cuatrovientos.org',
            estado: 'Activo',
            perfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
            disponibilidades: [
                { diaSemana: { idDia: 1, nombre: 'Lunes' }, horaInicio: '09:00:00', horaFin: '13:00:00' },
                { diaSemana: { idDia: 3, nombre: 'Miércoles' }, horaInicio: '09:00:00', horaFin: '13:00:00' }
            ],
            tiposActividad: [{ descripcion: 'Tecnología' }, { descripcion: 'Medio Ambiente' }]
        },
        {
            nif: '87654321B',
            nombre: 'Ana',
            apellido1: 'López',
            apellido2: 'Martínez',
            grado: { descripcion: '1º SMR' },
            mail: 'ana.lopez@cuatrovientos.org',
            estado: 'Activo',
            perfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
            disponibilidades: [
                { diaSemana: { idDia: 5, nombre: 'Viernes' }, horaInicio: '16:00:00', horaFin: '20:00:00' }
            ],
            tiposActividad: [{ descripcion: 'Social' }]
        },
        {
            nif: '11223344C',
            nombre: 'Carlos',
            apellido1: 'Ruiz',
            apellido2: 'Sánchez',
            grado: { descripcion: '2º Administración' },
            mail: 'carlos.ruiz@cuatrovientos.org',
            estado: 'Inactivo',
            perfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
            disponibilidades: [],
            tiposActividad: [{ descripcion: 'Deporte' }, { descripcion: 'Educación' }]
        },
        {
            nif: '55667788D',
            nombre: 'María',
            apellido1: 'González',
            apellido2: 'Fernández',
            grado: { descripcion: '1º Marketing' },
            mail: 'maria.gonzalez@cuatrovientos.org',
            estado: 'Activo',
            perfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            disponibilidades: [],
            tiposActividad: [{ descripcion: 'Arte' }]
        },
        {
            nif: '99887766E',
            nombre: 'Luis',
            apellido1: 'Rodríguez',
            apellido2: 'Jiménez',
            grado: { descripcion: '2º DAM' },
            mail: 'luis.rodriguez@cuatrovientos.org',
            estado: 'Pendiente',
            perfilUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis',
            disponibilidades: [],
            tiposActividad: [{ descripcion: 'Tecnología' }]
        }
    ];

    constructor(private http: HttpClient) { }

    getAll(): Observable<Voluntario[]> {
        // return this.http.get<Voluntario[]>(this.apiUrl);
        return of(this.mockVolunteers as Voluntario[]);
    }

    getById(nif: string): Observable<Voluntario> {
        return this.http.get<Voluntario>(`${this.apiUrl}/${nif}`);
    }

    // Note: API might not support POST/PUT/DELETE for Voluntario yet based on controller analysis
    create(voluntario: Voluntario): Observable<Voluntario> {
        return this.http.post<Voluntario>(this.apiUrl, voluntario);
    }

    update(voluntario: Voluntario): Observable<Voluntario> {
        return this.http.put<Voluntario>(this.apiUrl, voluntario);
    }
}
