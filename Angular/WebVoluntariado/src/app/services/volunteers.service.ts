import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Volunteer {
    id: number;
    name: string;
    birthDate: string;
    group: string;
    course: string;
    interests: string[];
    image: string;
}

@Injectable({
    providedIn: 'root'
})
export class VolunteersService {

    private volunteers: Volunteer[] = [
        {
            id: 1,
            name: 'Juan Pérez',
            birthDate: '1995-05-15',
            group: 'Grupo A',
            course: '2023-2024',
            interests: ['Jardinería', 'Deportes'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
        },
        {
            id: 2,
            name: 'Ana García',
            birthDate: '1998-08-20',
            group: 'Grupo B',
            course: '2023-2024',
            interests: ['Manualidades', 'Lectura'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
        },
        {
            id: 3,
            name: 'Carlos López',
            birthDate: '1992-12-10',
            group: 'Grupo A',
            course: '2022-2023',
            interests: ['Tecnología', 'Cocina'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
        },
        {
            id: 4,
            name: 'María Rodríguez',
            birthDate: '2000-03-25',
            group: 'Grupo C',
            course: '2023-2024',
            interests: ['Música', 'Baile'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
        },
        {
            id: 5,
            name: 'Luis González',
            birthDate: '1990-07-05',
            group: 'Grupo B',
            course: '2022-2023',
            interests: ['Cine', 'Viajes'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis'
        },
        {
            id: 6,
            name: 'Elena Martínez',
            birthDate: '1997-11-15',
            group: 'Grupo C',
            course: '2023-2024',
            interests: ['Fotografía', 'Arte'],
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
        }
    ];

    constructor() { }

    getVolunteers(): Observable<Volunteer[]> {
        return of(this.volunteers).pipe(delay(500));
    }
}
