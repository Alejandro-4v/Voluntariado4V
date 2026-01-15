import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ods } from '../models/ods.model';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class OdsService {

    private apiUrl = `${API_URL}/ods`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Ods[]> {
        return this.http.get<Ods[]>(this.apiUrl);
    }

    create(ods: Ods): Observable<Ods> {
        return this.http.post<Ods>(this.apiUrl, ods);
    }

    update(ods: Ods): Observable<Ods> {
        return this.http.put<Ods>(this.apiUrl, ods);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
