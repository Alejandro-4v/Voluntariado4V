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

    constructor(private http: HttpClient) { }

    getAll(): Observable<Actividad[]> {
        return this.http.get<Actividad[]>(this.apiUrl);
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
