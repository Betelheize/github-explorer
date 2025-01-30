import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed z-50 flex flex-col gap-2 p-4 pointer-events-none safe-area-inset">
      @for (toast of toastService.toasts$ | async; track toast.id) {
        <div 
          class="flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl transition-all duration-300 pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-md"
          [class]="getToastClasses(toast)"
          @toastAnimation
          (click)="toastService.remove(toast.id)"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ toast.message }}</p>
          </div>
          <button 
            class="shrink-0 ml-2 text-current opacity-70 hover:opacity-100 transition-opacity touch-manipulation"
            (click)="toastService.remove(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .safe-area-inset {
      bottom: max(1rem, env(safe-area-inset-bottom));
      right: max(1rem, env(safe-area-inset-right));
      left: max(1rem, env(safe-area-inset-left));
    }

    @media (min-width: 640px) {
      .safe-area-inset {
        left: auto;
        bottom: max(1rem, env(safe-area-inset-bottom));
        right: max(1rem, env(safe-area-inset-right));
      }
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(100%)',
          height: 0,
          margin: 0,
          padding: 0
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          opacity: 1, 
          transform: 'translateY(0)',
          height: '*',
          margin: '*',
          padding: '*'
        }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          opacity: 0, 
          transform: 'translateY(100%)',
          height: 0,
          margin: 0,
          padding: 0
        }))
      ])
    ])
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getToastClasses(toast: Toast): string {
    const baseClasses = 'border border-gray-800/50';
    
    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-900/20 text-green-400 border-green-800/30`;
      case 'error':
        return `${baseClasses} bg-red-900/20 text-red-400 border-red-800/30`;
      default:
        return `${baseClasses} bg-blue-900/20 text-blue-400 border-blue-800/30`;
    }
  }
} 