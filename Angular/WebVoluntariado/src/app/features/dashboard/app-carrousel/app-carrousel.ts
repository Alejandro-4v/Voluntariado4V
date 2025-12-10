import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from '../activity-card-component/activity-card-component';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent],
  templateUrl: './app-carrousel.html',
})
export class AppCarrouselComponent implements AfterViewInit {

  @Input() items: any[] = [];

  @ViewChild('track', { static: true }) trackRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // Ensure trackRef exists
  }

  scroll(direction: 'left' | 'right') {
    const track = this.trackRef?.nativeElement;
    if (!track) return;

    // Try to compute a sensible scroll amount: width of first child + gap
    const firstChild = track.querySelector('.flex-shrink-0') as HTMLElement;
    let scrollAmount = track.clientWidth; // fallback

    if (firstChild) {
      const childRect = firstChild.getBoundingClientRect();
      scrollAmount = Math.round(childRect.width);

      // Try to include gap if defined on the container
      const style = window.getComputedStyle(track as Element);
      const gap = style.getPropertyValue('gap') || style.getPropertyValue('column-gap') || '';
      if (gap) {
        // gap may be in px or rem; parse px only, otherwise ignore
        if (gap.endsWith('px')) {
          scrollAmount += Math.round(parseFloat(gap));
        }
      }
    }

    const left = direction === 'left' ? -scrollAmount : scrollAmount;
    track.scrollBy({ left, behavior: 'smooth' });
  }
}
