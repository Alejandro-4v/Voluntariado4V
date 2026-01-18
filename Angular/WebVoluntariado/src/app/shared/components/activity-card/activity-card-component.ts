import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card-component.html',
  styleUrl: './activity-card-component.scss',
})
export class ActivityCardComponent {
  @Input() name!: string;
  @Input() type!: string;
  @Input() slots!: number;
  @Input() filled!: number;
  @Input() image?: string;
  @Input() showIcon: boolean = true;
  @Input() imageFit: 'cover' | 'contain' = 'cover';
  @Input() customBackground?: string;

  @Output() cardClick = new EventEmitter<void>();

  
  private iconPaths: { [key: string]: string } = {
    'Medio Ambiente': 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16', 
    'Social': 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z', 
    'Tercera Edad': 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z', 
    'Educación': 'M12 12.713l-1.954 1.303a.5.5 0 0 1-.555 0L7.546 12.713a.5.5 0 0 1 .277-.916h4.9a.5.5 0 0 1 .277.916zM2.5 5.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-8z', 
    'Tecnología': 'M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V1zm1 0v14h6V1H9zM5 0h2v16H5V0zm-4 2h2v12H1V2z', 
    'default': 'M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002z' 
  };

  getIconPath(): string {
    return this.iconPaths[this.type] || this.iconPaths['default'];
  }

  getProgressPercentage(): number {
    return this.slots > 0 ? Math.round((this.filled / this.slots) * 100) : 0;
  }

  onCardClick() {
    this.cardClick.emit();
  }
}
