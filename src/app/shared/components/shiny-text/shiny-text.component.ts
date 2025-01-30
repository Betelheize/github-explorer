import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shiny-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="relative inline-block font-semibold overflow-hidden"
      [class.opacity-50]="disabled"
    >
      <span 
        class="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-transparent bg-clip-text"
        [class.animate-shine]="!disabled"
      >
        {{ text }}
      </span>
      <div 
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shine-move"
        [style.animation-duration.s]="speed"
      ></div>
    </div>
  `,
  styles: [`
    @keyframes shine {
      to {
        background-position: 200% center;
      }
    }

    @keyframes shineMove {
      from {
        transform: translateX(-200%) skewX(-12deg);
      }
      to {
        transform: translateX(200%) skewX(-12deg);
      }
    }

    .animate-shine {
      animation: shine 8s linear infinite;
      background-size: 200% auto;
    }

    .animate-shine-move {
      animation: shineMove var(--speed, 3s) ease-out infinite;
      opacity: 0.7;
      mix-blend-mode: overlay;
    }
  `]
})
export class ShinyTextComponent implements AfterViewInit {
  @Input() text = '';
  @Input() disabled = false;
  @Input() speed = 3;
  @Input() className = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.className) {
      this.el.nativeElement.classList.add(...this.className.split(' '));
    }
  }
} 