import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Actividad } from '../models/actividad.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ActivitiesService {

    private apiUrl = `${API_URL}/actividad`;

    // MOCK DATA
    private mockActivities: any[] = [
        {
            idActividad: 1,
            nombre: 'Limpieza del Río Arga',
            descripcion: 'Jornada de limpieza y conservación de las orillas del río Arga. Se proporcionará material de limpieza y guantes.',
            estado: 'A',
            inicio: '2024-05-15T09:00:00',
            fin: '2024-05-15T13:00:00',
            imagenUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=1000',
            convoca: { nombre: 'Cruz Roja Navarra' },
            tiposActividad: [{ descripcion: 'Medio Ambiente' }],
            ods: [{ descripcion: 'Vida Submarina' }, { descripcion: 'Acción por el Clima' }],
            voluntarios: [{}, {}, {}], // 3 voluntarios
            slots: 20
        },
        {
            idActividad: 2,
            nombre: 'Acompañamiento a Mayores',
            descripcion: 'Visita y acompañamiento a personas mayores en la residencia Solera. Juegos de mesa y conversación.',
            estado: 'A',
            inicio: '2024-05-20T16:00:00',
            fin: '2024-05-20T18:00:00',
            imagenUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000',
            convoca: { nombre: 'Solera Asistencial' },
            tiposActividad: [{ descripcion: 'Social' }, { descripcion: 'Tercera Edad' }],
            ods: [{ descripcion: 'Salud y Bienestar' }, { descripcion: 'Reducción de las Desigualdades' }],
            voluntarios: [{}, {}, {}, {}, {}], // 5 voluntarios
            slots: 10
        },
        {
            idActividad: 3,
            nombre: 'Recogida de Alimentos',
            descripcion: 'Campaña de recogida de alimentos en supermercados locales para el Banco de Alimentos.',
            estado: 'P', // Pendiente
            inicio: '2024-06-01T10:00:00',
            fin: '2024-06-01T20:00:00',
            imagenUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000',
            convoca: { nombre: 'Banco de Alimentos' },
            tiposActividad: [{ descripcion: 'Social' }],
            ods: [{ descripcion: 'Hambre Cero' }],
            voluntarios: [],
            slots: 50
        },
        {
            idActividad: 4,
            nombre: 'Taller de Informática Básica',
            descripcion: 'Impartir clases de informática básica a personas mayores. Uso del móvil y navegación por internet.',
            estado: 'F', // Finalizada
            inicio: '2024-04-10T17:00:00',
            fin: '2024-04-10T19:00:00',
            imagenUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
            convoca: { nombre: 'Cuatrovientos' },
            tiposActividad: [{ descripcion: 'Educación' }, { descripcion: 'Tecnología' }],
            ods: [{ descripcion: 'Educación de Calidad' }],
            voluntarios: [{}, {}, {}],
            slots: 15
        }
    ];

    constructor(private http: HttpClient) { }

    getAll(): Observable<Actividad[]> {
        // return this.http.get<Actividad[]>(this.apiUrl);
        return of(this.mockActivities as Actividad[]);
    }

    getById(id: number): Observable<Actividad> {
        return this.http.get<Actividad>(`${this.apiUrl}/${id}`);
    }

    create(actividad: Actividad): Observable<Actividad> {
        return this.http.post<Actividad>(this.apiUrl, actividad);
    }

    update(id: number, actividad: Actividad): Observable<Actividad> {
        return this.http.put<Actividad>(`${this.apiUrl}/${id}`, actividad);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
