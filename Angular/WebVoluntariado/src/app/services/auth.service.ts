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
  login(email: string, password: string, type: 'voluntario' | 'entidad' | 'administrador' = 'voluntario'): Observable<{ success: boolean; user?: User; message?: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}?usuario=${type}`, { loginMail: email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticated$.next(true);
        }
      }),
      switchMap(response => {
        // Fetch user details based on type
        let userDetails$: Observable<any>;
        if (type === 'voluntario') {
          // Assuming we can search by email or we have to fetch all and filter (inefficient but consistent with previous logic if no specific search endpoint)
          // Ideally: GET /voluntario?mail=email or GET /voluntario/{nif} if we knew NIF. 
          // Since we only have email, we might need to fetch all or if there's a filter endpoint.
          // The controller supports filters: $voluntarios = $voluntarioRepository->findByFilters($filters);
          // So we can try: GET /voluntario?mail=email
          userDetails$ = this.http.get<Voluntario[]>(`${API_URL}/voluntario?mail=${email}`).pipe(
            map(volunteers => volunteers[0])
          );
        } else if (type === 'entidad') {
          // EntidadController also supports filters.
          // GET /entidad?loginMail=email (or contactMail?)
          // Let's try loginMail first as it's the credential.
          userDetails$ = this.http.get<Entidad[]>(`${API_URL}/entidad?loginMail=${email}`).pipe(
            map(entities => entities[0])
          );
        } else {
          // AdministradorController: GET /administrador/{loginMail}
          userDetails$ = this.http.get<any>(`${API_URL}/administrador/${email}`);
        }

        return userDetails$.pipe(
          map(details => {
            if (!details) {
              throw new Error('Usuario no encontrado tras login exitoso');
            }

            let user: User;
            if (type === 'voluntario') {
              const v = details as Voluntario;
              user = {
                nif: v.nif,
                email: v.mail,
                name: v.nombre + ' ' + v.apellido1,
                role: 'volunteer',
                details: v
              };
            } else if (type === 'entidad') {
              const e = details as Entidad;
              user = {
                id: e.idEntidad,
                cif: e.cif,
                email: e.loginMail || e.contactMail,
                name: e.nombre,
                role: 'entity',
                details: e
              };
            } else {
              const a = details; // Admin
              user = {
                email: a.loginMail,
                name: a.nombre,
                role: 'admin',
                details: a
              };
            }

            this.saveUserSession(user);
            return { success: true, user };
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
