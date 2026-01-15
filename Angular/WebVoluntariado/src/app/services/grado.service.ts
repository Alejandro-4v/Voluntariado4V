import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grado } from '../models/grado.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class GradoService {

    private apiUrl = `${API_URL}/grado`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Grado[]> {
        return this.http.get<Grado[]>(this.apiUrl);
    }

    create(grado: Grado): Observable<Grado> {
        return this.http.post<Grado>(this.apiUrl, grado);
    }

    update(grado: Grado): Observable<Grado> {
        return this.http.put<Grado>(this.apiUrl, grado);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
