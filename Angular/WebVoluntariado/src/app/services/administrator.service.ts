import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface Administrador {
    loginMail: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    perfilUrl?: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdministratorService {

    private apiUrl = `${API_URL}/administrador`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Administrador[]> {
        return this.http.get<Administrador[]>(this.apiUrl);
    }

    getByLoginMail(loginMail: string): Observable<Administrador> {
        return this.http.get<Administrador>(`${this.apiUrl}/${loginMail}`);
    }

    create(administrador: Administrador): Observable<Administrador> {
        return this.http.post<Administrador>(this.apiUrl, administrador);
    }

    update(administrador: Administrador): Observable<Administrador> {
        return this.http.put<Administrador>(`${this.apiUrl}/${administrador.loginMail}`, administrador);
    }

    delete(loginMail: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${loginMail}`);
    }
}
