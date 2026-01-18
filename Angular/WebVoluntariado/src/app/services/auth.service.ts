import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, forkJoin } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { API_URL } from '../config/api.config';
import { Voluntario } from '../models/voluntario.model';
import { Entidad } from '../models/entidad.model';

export interface User {
  id?: number; // Optional now as API might not use numeric ID for all
  nif?: string;
  cif?: string;
  email: string;
  name: string;
  role: 'volunteer' | 'entity' | 'admin';
  gradeId?: number;
  details?: Voluntario | Entidad; // Store full details
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private apiUrl = `${API_URL}/login`;

  constructor(private http: HttpClient) {
    // Recuperar sesión si existe
    this.checkExistingSession();
  }

  /**
   * Login contra la API
   */
  login(email: string, password: string, type: 'voluntario' | 'entidad' | 'administrador' = 'voluntario'): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}?usuario=${type}`, { loginMail: email, password }).pipe(
      map(response => {
        if (response.token && response.user) {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticated$.next(true);
          this.saveUserSession(response.user);
          return { success: true, user: response.user };
        }
        return { success: false, message: 'Respuesta inválida del servidor' };
      }),
      catchError(error => {
        console.error('Login error', error);
        // Extract the specific error message from the backend response if available
        let message = error.error?.error || 'Credenciales incorrectas o error de servidor';

        // Translate common errors to professional Spanish
        if (message === 'Invalid credentials') {
          message = 'El correo electrónico o la contraseña son incorrectos.';
        }

        return of({ success: false, message });
      })
    );
  }

  private saveUserSession(user: User) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUser$.next(user);
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  /**
   * Obtener usuario actual (observable)
   */
  getCurrentUser$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  /**
   * Obtener usuario actual (valor sincrónico)
   */
  getCurrentUser(): User | null {
    return this.currentUser$.getValue();
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Verificar sesión existente en localStorage
   */
  private checkExistingSession(): void {
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        this.logout();
      }
    }
  }
}
