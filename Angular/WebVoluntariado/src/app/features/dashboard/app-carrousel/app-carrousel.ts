import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
export class AppCarrouselComponent implements AfterViewInit, AfterViewChecked {
  // usamos setter para detectar cuando llegan items (útil si parent hace *ngIf o rellena después)
  private _items: any[] = [];
  @Input()
  set items(v: any[]) {
    this._items = v || [];
    this.onItemsChanged();
  }
  get items() { return this._items; }

  @Input() cardType: 'activity' | 'proposal' | 'entity' = 'activity';
  @Output() cardClick = new EventEmitter<any>();
  @ViewChild('track', { static: false }) track!: ElementRef<HTMLElement>;

  activeIndex = 0;
  private initialized = false;
  private pendingInit = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // podríamos no tener track aún si componente fue renderizado oculto; detectaremos en AfterViewChecked
    this.tryInit();
  }

  ngAfterViewChecked() {
    // se llama varias veces; solo hacemos la inicialización una vez
    this.tryInit();
  }

  private onItemsChanged() {
    // si el elemento ya existe, recalcula; si no, marca como pendiente
    if (this.track && this.track.nativeElement) {
      // esperar un tick para que Angular haya renderizado children
      setTimeout(() => {
        this.updateActiveIndex();
      }, 0);
    } else {
      this.pendingInit = true;
    }
  }

  private tryInit() {
    if (this.initialized) return;
    if (this.track && this.track.nativeElement) {
      this.initialized = true;
      this.pendingInit = false;
      // opcional: debug
      // console.log('Carrousel track inicializado', this.track.nativeElement);
      // forzar CD si necesitamos
      this.cdr.detectChanges();
      // si hay items ya, actualizamos índice
      setTimeout(() => this.updateActiveIndex(), 0);
    }
  }

  private updateActiveIndex() {
    const el = this.track?.nativeElement;
    if (!el) return;
    // recalcula activeIndex en función del scroll actual
    const cardWidth = this.getCardWidth(el);
    if (cardWidth > 0) {
      this.activeIndex = Math.round(el.scrollLeft / cardWidth);
    } else {
      this.activeIndex = 0;
    }
  }

  private getCardWidth(el: HTMLElement) {
    // En desktop mostramos 3 tarjetas visibles; en mobile usamos el ancho del contenedor
    const containerWidth = el.clientWidth;
    // si hay card-width explícito, podemos intentar leer el primer hijo
    const firstCard = el.querySelector('.card-width') as HTMLElement | null;
    if (firstCard) return firstCard.offsetWidth;
    // fallback: asumimos container/3 en desktop
    return containerWidth / 3;
  }

scroll(direction: 'left' | 'right') {
  const el = this.track?.nativeElement;
  if (!el) return;

  const firstCard = el.querySelector('.card-width') as HTMLElement;
  if (!firstCard) return;

  // Calcular ancho real de la card (incluyendo margenes)
  const style = window.getComputedStyle(firstCard);
  const marginRight = parseFloat(style.marginRight) || 0;
  const marginLeft = parseFloat(style.marginLeft) || 0;
  const cardWidth = firstCard.offsetWidth + marginLeft + marginRight;

  // Distancia a mover (positivo o negativo según dirección)
  const amount = direction === 'left' ? -cardWidth : cardWidth;

  // Posición actual y límites
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  let newScrollLeft = el.scrollLeft + amount;

  // Limitar scroll para que no pase los extremos
  if (newScrollLeft < 0) newScrollLeft = 0;
  if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

  // Scroll a la nueva posición
  el.scrollTo({ left: newScrollLeft, behavior: 'smooth' });

  console.log('scrollBy cardWidth:', cardWidth);
  console.log('scrollLeft actual:', el.scrollLeft);
  console.log('nuevo scrollLeft:', newScrollLeft);
}


  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const cardWidth = this.getCardWidth(el);
    if (cardWidth > 0) {
      this.activeIndex = Math.round(el.scrollLeft / cardWidth);
    } else {
      this.activeIndex = 0;
    }
  }

  scrollToIndex(index: number) {
  const el = this.track?.nativeElement;
  if (!el) return;

  const firstCard = el.querySelector('.card-width') as HTMLElement;
  if (!firstCard) return;

  const cardWidth = firstCard.offsetWidth;

  el.scrollTo({
    left: index * cardWidth,
    behavior: 'smooth'
  });
}

onActivityClick(item: any) {
  this.cardClick.emit(item);
}

}
