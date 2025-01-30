import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="animate-pulse bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 rounded-xl"
      [ngStyle]="{ 
        'width': width,
        'height': height,
        'border-radius': rounded === 'full' ? '9999px' : '0.75rem'
      }"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      background-size: 200% 100%;
      background-position: -100% 0;
    }

    @keyframes pulse {
      0%, 100% {
        background-position: -100% 0;
      }
      50% {
        background-position: 100% 0;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() rounded: 'full' | 'xl' = 'xl';
} 