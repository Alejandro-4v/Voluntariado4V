import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Entity {
    id: number;
    name: string;
    registrationDate: string;
    responsible: string;
    types: string[];
    image: string;
}

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {

    private entities: Entity[] = [
        {
            id: 1,
            name: 'Asociación Amigos del Parque',
            registrationDate: '2020-01-15',
            responsible: 'Pedro Gómez',
            types: ['Medio Ambiente', 'Comunitario'],
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Amigos'
        },
        {
            id: 2,
            name: 'Fundación Ayuda Total',
            registrationDate: '2019-05-20',
            responsible: 'Laura Díaz',
            types: ['Social', 'Salud'],
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Ayuda'
        },
        {
            id: 3,
            name: 'Club Deportivo Solidario',
            registrationDate: '2021-03-10',
            responsible: 'Miguel Ángel',
            types: ['Deporte', 'Juventud'],
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Deportivo'
        },
        {
            id: 4,
            name: 'Centro Cultural Renacer',
            registrationDate: '2018-11-05',
            responsible: 'Sofía Ruiz',
            types: ['Cultura', 'Arte'],
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Renacer'
        },
        {
            id: 5,
            name: 'ONG Futuro Verde',
            registrationDate: '2022-02-28',
            responsible: 'Javier Martín',
            types: ['Ecología', 'Sostenibilidad'],
            image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Futuro'
        }
    ];

    constructor() { }

    getEntities(): Observable<Entity[]> {
        return of(this.entities).pipe(delay(500));
    }
}
