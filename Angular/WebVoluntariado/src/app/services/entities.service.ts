import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Entidad } from '../models/entidad.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {

    private apiUrl = `${API_URL}/entidad`;

    // MOCK DATA
    private mockEntities: any[] = [
        {
            idEntidad: 1,
            nombre: 'Cruz Roja Navarra',
            fechaRegistro: '2020-01-15T00:00:00',
            nombreResponsable: 'Pedro Gómez',
            contactMail: 'contacto@cruzroja.es',
            perfilUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=CruzRoja',
            actividades: [{ nombre: 'Recogida de Ropa' }, { nombre: 'Apoyo Escolar' }] // 2 actividades
        },
        {
            idEntidad: 2,
            nombre: 'Solera Asistencial',
            fechaRegistro: '2019-05-20T00:00:00',
            nombreResponsable: 'Laura Díaz',
            contactMail: 'info@solera.es',
            perfilUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Solera',
            actividades: [{ nombre: 'Acompañamiento' }, { nombre: 'Paseos' }, { nombre: 'Lectura' }] // 3 actividades
        },
        {
            idEntidad: 3,
            nombre: 'Banco de Alimentos',
            fechaRegistro: '2021-03-10T00:00:00',
            nombreResponsable: 'Miguel Ángel',
            contactMail: 'banco@alimentos.es',
            perfilUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Banco',
            actividades: [{ nombre: 'Gran Recogida' }] // 1 actividad
        },
        {
            idEntidad: 4,
            nombre: 'Asociación Síndrome de Down',
            fechaRegistro: '2018-11-05T00:00:00',
            nombreResponsable: 'Sofía Ruiz',
            contactMail: 'asociacion@down.es',
            perfilUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Down',
            actividades: []
        },
        {
            idEntidad: 5,
            nombre: 'Protectora de Animales',
            fechaRegistro: '2022-02-28T00:00:00',
            nombreResponsable: 'Javier Martín',
            contactMail: 'adopciones@protectora.es',
            perfilUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Protectora',
            actividades: [{ nombre: 'Paseo de Perros' }, { nombre: 'Limpieza' }]
        }
    ];

    constructor(private http: HttpClient) { }

    getAll(): Observable<Entidad[]> {
        // return this.http.get<Entidad[]>(this.apiUrl);
        return of(this.mockEntities as Entidad[]);
    }

    getById(id: number): Observable<Entidad> {
        return this.http.get<Entidad>(`${this.apiUrl}/${id}`);
    }

    create(entidad: Entidad): Observable<Entidad> {
        return this.http.post<Entidad>(this.apiUrl, entidad);
    }

    update(entidad: Entidad): Observable<Entidad> {
        return this.http.put<Entidad>(this.apiUrl, entidad);
    }
}
