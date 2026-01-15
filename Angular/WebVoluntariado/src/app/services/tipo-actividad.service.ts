import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoActividad } from '../models/tipo-actividad.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class TipoActividadService {

    private apiUrl = `${API_URL}/tipoActividad`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<TipoActividad[]> {
        return this.http.get<TipoActividad[]>(this.apiUrl);
    }

    getById(id: number): Observable<TipoActividad> {
        return this.http.get<TipoActividad>(`${this.apiUrl}/${id}`);
    }

    getInUse(): Observable<TipoActividad[]> {
        return this.http.get<TipoActividad[]>(`${this.apiUrl}EnUso`);
    }

    create(tipoActividad: TipoActividad): Observable<TipoActividad> {
        return this.http.post<TipoActividad>(this.apiUrl, tipoActividad);
    }

    update(tipoActividad: TipoActividad): Observable<TipoActividad> {
        return this.http.put<TipoActividad>(this.apiUrl, tipoActividad);
    }
}
