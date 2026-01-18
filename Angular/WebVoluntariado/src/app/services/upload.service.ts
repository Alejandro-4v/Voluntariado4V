import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private apiUrl = `${API_URL}/upload`;

    constructor(private http: HttpClient) { }

    uploadImage(file: File): Observable<{ url: string; filename: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ url: string; filename: string }>(this.apiUrl, formData);
    }
}
