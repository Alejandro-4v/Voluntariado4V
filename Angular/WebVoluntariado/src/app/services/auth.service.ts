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
  login(email: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { loginMail: email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticated$.next(true);
        }
      }),
      switchMap(response => {
        // Una vez tenemos token, intentamos buscar al usuario en Voluntarios o Entidades
        // Como la API no tiene endpoint /me, buscamos por email en las listas
        // Esto es ineficiente pero necesario dada la API actual

        const volunteers$ = this.http.get<Voluntario[]>(`${API_URL}/voluntario`);
        const entities$ = this.http.get<Entidad[]>(`${API_URL}/entidad`);

        return forkJoin([volunteers$, entities$]).pipe(
          map(([volunteers, entities]) => {
            // Buscar en voluntarios
            const volunteer = volunteers.find(v => v.mail === email);
            if (volunteer) {
              const user: User = {
                nif: volunteer.nif,
                email: volunteer.mail,
                name: volunteer.nombre + ' ' + volunteer.apellido1,
                role: 'volunteer',
                details: volunteer
              };
              this.saveUserSession(user);
              return { success: true, user };
            }

            // Buscar en entidades (usando contactMail o loginMail si estuviera disponible en el modelo, asumimos contactMail por ahora o coincidencia)
            // Nota: Entidad tiene contactMail. El login usa loginMail. 
            // Si el loginMail es diferente del contactMail, esto podría fallar si la API no devuelve loginMail en el GET /entidad.
            // Asumiremos que el usuario usa el contactMail o que podemos encontrarlo.
            const entity = entities.find(e => e.contactMail === email);
            if (entity) {
              const user: User = {
                id: entity.idEntidad,
                cif: entity.cif,
                email: entity.contactMail,
                name: entity.nombre,
                role: 'entity',
                details: entity
              };
              this.saveUserSession(user);
              return { success: true, user };
            }

            // Si no es ni voluntario ni entidad, podría ser admin (hardcoded por ahora si no hay endpoint de admins)
            if (email === 'admin@cuatrovientos.org') {
              const user: User = {
                email: email,
                name: 'Admin',
                role: 'admin'
              };
              this.saveUserSession(user);
              return { success: true, user };
            }

            throw new Error('Usuario no encontrado en los registros');
          })
        );
      }),
      catchError(error => {
        console.error('Login error', error);
        return of({ success: false, message: 'Credenciales incorrectas o error de servidor' });
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
