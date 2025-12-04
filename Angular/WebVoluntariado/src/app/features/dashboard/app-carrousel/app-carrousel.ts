import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from '../activity-card-component/activity-card-component';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent],
  templateUrl: './app-carrousel.html',
})
export class AppCarrouselComponent {
  @Input() items: any[] = [];
  @ViewChild('track', { static: false }) track!: ElementRef;

  scroll(direction: 'left' | 'right') {
    const el = this.track?.nativeElement || document.querySelector('.carrousel-track');
    if (!el) return;

    const cardWidth = el.offsetWidth / 3; // Siempre 3 cards visibles
    const amount = direction === 'left' ? -cardWidth : cardWidth;

    el.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }
}
