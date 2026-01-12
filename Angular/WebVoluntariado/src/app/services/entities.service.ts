import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entidad } from '../models/entidad.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {

    private apiUrl = `${API_URL}/entidad`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Entidad[]> {
        return this.http.get<Entidad[]>(this.apiUrl);
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
