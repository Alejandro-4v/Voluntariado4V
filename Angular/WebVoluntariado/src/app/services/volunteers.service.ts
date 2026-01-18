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

    

    constructor(private http: HttpClient) { }

    getAll(): Observable<Voluntario[]> {
        return this.http.get<Voluntario[]>(this.apiUrl);
    }

    getById(nif: string): Observable<Voluntario> {
        return this.http.get<Voluntario>(`${this.apiUrl}/${nif}`);
    }

    
    create(voluntario: Voluntario): Observable<Voluntario> {
        return this.http.post<Voluntario>(this.apiUrl, voluntario);
    }

    update(voluntario: Voluntario): Observable<Voluntario> {
        return this.http.put<Voluntario>(`${this.apiUrl}/${voluntario.nif}`, voluntario);
    }

    delete(nif: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${nif}`);
    }
}
