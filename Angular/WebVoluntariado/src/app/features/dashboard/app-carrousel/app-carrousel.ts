import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCardComponent } from '../activity-card-component/activity-card-component';
import { ProposalCardComponent } from '../proposal-card/proposal-card.component';
import { EntityCardComponent } from '../entity-card/entity-card.component';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [CommonModule, ActivityCardComponent, ProposalCardComponent, EntityCardComponent],
  templateUrl: './app-carrousel.html',
  styleUrls: ['./app-carrousel.scss']
})
export class AppCarrouselComponent implements AfterViewInit {

  @Input() items: any[] = [];
  @Input() cardType: 'activity' | 'proposal' | 'entity' = 'activity';
  @ViewChild('track', { static: false }) track!: ElementRef;
  activeIndex = 0;

  scroll(direction: 'left' | 'right') {
    const el = this.track?.nativeElement || document.querySelector('.carrousel-track');
    if (!el) return;

    const cardWidth = el.offsetWidth / 3; // Siempre 3 cards visibles en desktop
    const amount = direction === 'left' ? -cardWidth : cardWidth;

    el.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth; // En mobile es 100% del ancho
    this.activeIndex = Math.round(scrollLeft / cardWidth);
  }

  scrollToIndex(index: number) {
    const el = this.track?.nativeElement;
    if (!el) return;
    const cardWidth = el.offsetWidth;
    el.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  }
}
