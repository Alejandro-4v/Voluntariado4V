import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, switchMap } from 'rxjs/operators';

export interface User {
  id: number;
  nif?: string; // Added for API matching
  email: string;
  name: string;
  role: 'volunteer' | 'entity' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  // Mock data - Usuarios de prueba
  private mockUsers: User[] = [
    {
      id: 1,
      nif: '11111111A',
      email: 'iryna_pavlenko@cuatrovientos.org',
      name: 'Iryna Pavlenko',
      role: 'volunteer'
    },
    {
      id: 2,
      nif: '22222222B',
      email: 'voluntario@test.com',
      name: 'Juan García',
      role: 'volunteer'
    },
    {
      id: 3,
      email: 'entity@amabir.org',
      name: 'Amabir Organización',
      role: 'entity'
    },
    {
      id: 4,
      email: 'admin@cuatrovientos.org',
      name: 'Admin Cuatrovientos',
      role: 'admin'
    }
  ];

  constructor() {
    // Recuperar sesión si existe
    this.checkExistingSession();
  }

  /**
   * Login con credenciales mock
   * Contraseña para todos: "password123"
   */
  login(email: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    // Simular delay de red
    return of({ success: false }).pipe(
      delay(1000),
      tap(() => {
        // Mock de validación
        if (password !== 'password123') {
          throw new Error('Contraseña incorrecta');
        }

        const user = this.mockUsers.find(u => u.email === email);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        // Guardar en localStorage
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', 'mock_token_' + user.id);

        // Actualizar BehaviorSubjects
        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);
      }),
      // Retornar respuesta
      switchMap(() => {
        const user = this.mockUsers.find(u => u.email === email);
        return of({ success: true, user });
      })
    );
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

  /**
   * Obtener usuarios mock para testing
   */
  getMockUsers(): User[] {
    return this.mockUsers;
  }
}
