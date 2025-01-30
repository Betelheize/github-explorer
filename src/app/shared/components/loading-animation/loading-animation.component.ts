import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-loading-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" #loadingContainer>
      <div class="loading-circle" #circle1></div>
      <div class="loading-circle" #circle2></div>
      <div class="loading-circle" #circle3></div>
      <div class="loading-glow" #glow></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .loading-container {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }

    .loading-circle {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: blur(0.5px);
    }

    .loading-glow {
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      filter: blur(10px);
    }
  `]
})
export class LoadingAnimationComponent implements OnInit {
  @ViewChild('circle1') circle1!: ElementRef;
  @ViewChild('circle2') circle2!: ElementRef;
  @ViewChild('circle3') circle3!: ElementRef;
  @ViewChild('glow') glow!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => this.initAnimation(), 0);
  }

  private initAnimation(): void {
    const timeline = gsap.timeline({ repeat: -1 });
    
    // Circle animations
    [this.circle1, this.circle2, this.circle3].forEach((circle, index) => {
      gsap.set(circle.nativeElement, {
        scale: 0.5,
        opacity: 0.7
      });

      timeline.to(circle.nativeElement, {
        duration: 1.5,
        rotation: 360,
        transformOrigin: '50% 50%',
        motionPath: {
          path: [
            { x: Math.cos(index * (Math.PI * 2 / 3)) * 30, y: Math.sin(index * (Math.PI * 2 / 3)) * 30 },
            { x: Math.cos((index + 1) * (Math.PI * 2 / 3)) * 30, y: Math.sin((index + 1) * (Math.PI * 2 / 3)) * 30 },
            { x: Math.cos((index + 2) * (Math.PI * 2 / 3)) * 30, y: Math.sin((index + 2) * (Math.PI * 2 / 3)) * 30 },
            { x: Math.cos(index * (Math.PI * 2 / 3)) * 30, y: Math.sin(index * (Math.PI * 2 / 3)) * 30 }
          ],
          curviness: 1.5
        },
        scale: 1,
        opacity: 1,
        ease: "power2.inOut"
      }, index * 0.2);
    });

    // Glow animation
    gsap.to(this.glow.nativeElement, {
      duration: 2,
      scale: 1.2,
      opacity: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
} 