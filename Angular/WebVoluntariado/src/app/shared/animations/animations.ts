import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
    ])
]);

export const fadeOut = trigger('fadeOut', [
    transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
    ])
]);

export const slideUp = trigger('slideUp', [
    transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
    ])
]);

export const staggerFade = trigger('staggerFade', [
    transition('* => *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger('100ms', [
                animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ], { optional: true })
    ])
]);

export const scaleIn = trigger('scaleIn', [
    transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: 'scale(1)', opacity: 1 }))
    ])
]);
