import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voluntario } from '../models/voluntario.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class VolunteersService {

    private apiUrl = `${API_URL}/voluntario`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Voluntario[]> {
        return this.http.get<Voluntario[]>(this.apiUrl);
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
