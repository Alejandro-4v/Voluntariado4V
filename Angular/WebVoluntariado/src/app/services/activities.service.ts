import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Activity {
    name: string;
    type: string;
    slots: number;
    filled: number;
    image: string;
    entity?: string;
    date?: string;
    rating?: number | null;
    customBackground?: string;
    showIcon?: boolean;
    imageFit?: 'cover' | 'contain';
}

@Injectable({
    providedIn: 'root'
})
export class ActivitiesService {

    // Mock Data
    private entitiesActivities = [
        {
            entity: 'Amabir',
            activities: [
                { name: 'Actividad de jardín', type: 'Jardinería', slots: 5, filled: 1, image: '' },
                { name: 'Taller de manualidades', type: 'Manualidades', slots: 5, filled: 3, image: '' },
                { name: 'Paseo acompañado', type: 'Acompañamiento', slots: 5, filled: 0, image: '' },
                { name: 'Lectura compartida', type: 'Lectura', slots: 5, filled: 2, image: '' }
            ]
        },
        {
            entity: 'Solera Asistencial',
            activities: [
                { name: 'Ayuda en tareas', type: 'Apoyo', slots: 5, filled: 1, image: '' },
                { name: 'Compañía en residencia', type: 'Acompañamiento', slots: 5, filled: 4, image: '' },
                { name: 'Apoyo administrativo', type: 'Administrativo', slots: 5, filled: 2, image: '' }
            ]
        }
    ];

    private proposals = [
        { name: 'Voluntariado en eventos', type: 'Eventos', slots: 10, filled: 2, image: '', customBackground: '#fff', showIcon: true },
        { name: 'Taller de tecnología', type: 'Tecnología', slots: 8, filled: 5, image: '', customBackground: '#fff', showIcon: true },
        { name: 'Limpieza comunitaria', type: 'Comunitario', slots: 12, filled: 7, image: '', customBackground: '#fff', showIcon: true }
    ];

    private otherEntities = [
        { name: 'Cáritas Diocesana', type: 'ONG Social', slots: 0, filled: 0, image: 'assets/caritas.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
        { name: 'Cruz Roja', type: 'Organización Humanitaria', slots: 0, filled: 0, image: 'assets/cruzroja.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' },
        { name: 'Fundación Española', type: 'Fundación', slots: 0, filled: 0, image: 'assets/fundacion.png', customBackground: '#fff', showIcon: false, imageFit: 'contain' }
    ];

    // Activities for Management Dashboard
    private managementUpcoming = [
        { name: 'Actividad de jardín', type: 'Amabir', slots: 5, filled: 1, image: '', customBackground: '#fff' },
        { name: 'Taller de manualidades', type: 'Amabir', slots: 5, filled: 3, image: '', customBackground: '#fff' },
        { name: 'Paseo acompañado', type: 'Amabir', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Ayuda en tareas', type: 'Solera', slots: 5, filled: 2, image: '', customBackground: '#fff' }
    ];

    private managementPast = [
        { name: 'Actividad pasada 1', type: 'Amabir', slots: 5, filled: 5, image: '', customBackground: '#fff' },
        { name: 'Actividad pasada 2', type: 'Solera', slots: 5, filled: 5, image: '', customBackground: '#fff' },
        { name: 'Actividad pasada 3', type: 'Cruz Roja', slots: 5, filled: 5, image: '', customBackground: '#fff' }
    ];

    private managementPending = [
        { name: 'Nueva propuesta', type: 'Entidad X', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Propuesta de taller', type: 'Entidad Y', slots: 5, filled: 0, image: '', customBackground: '#fff' },
        { name: 'Ayuda solicitada', type: 'Entidad Z', slots: 5, filled: 0, image: '', customBackground: '#fff' }
    ];


    constructor() { }

    getEntitiesActivities(): Observable<any[]> {
        return of(this.entitiesActivities).pipe(delay(500));
    }

    getProposals(): Observable<any[]> {
        return of(this.proposals).pipe(delay(500));
    }

    getOtherEntities(): Observable<any[]> {
        return of(this.otherEntities).pipe(delay(500));
    }

    // Management Methods
    getUpcomingActivities(): Observable<any[]> {
        return of(this.managementUpcoming).pipe(delay(500));
    }

    getPastActivities(): Observable<any[]> {
        return of(this.managementPast).pipe(delay(500));
    }

    getPendingActivities(): Observable<any[]> {
        return of(this.managementPending).pipe(delay(500));
    }
}
