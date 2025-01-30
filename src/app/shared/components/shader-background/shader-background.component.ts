import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-shader-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="fixed top-0 left-0 w-full h-full -z-10"></canvas>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShaderBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private uniforms!: { [uniform: string]: THREE.IUniform };
  private animationFrameId?: number;

  private vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  private fragmentShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Create a gradient base
      vec3 color1 = vec3(0.1, 0.12, 0.18); // Dark blue-gray
      vec3 color2 = vec3(0.15, 0.15, 0.25); // Lighter blue-gray
      
      // Time-based movement
      float movement = sin(time * 0.2) * 0.1;
      
      // Create organic shapes
      float shape1 = sin(uv.x * 10.0 + time * 0.3) * 0.5 + 0.5;
      float shape2 = cos(uv.y * 8.0 - time * 0.2) * 0.5 + 0.5;
      
      // Combine shapes with smooth transitions
      float pattern = smoothstep(0.4, 0.6, shape1 * shape2);
      
      // Add some noise
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      pattern = mix(pattern, noise, 0.05);
      
      // Mix colors based on the pattern
      vec3 finalColor = mix(color1, color2, pattern + movement);
      
      // Add subtle glow
      float glow = pow(pattern, 3.0) * 0.5;
      finalColor += vec3(0.3, 0.4, 0.5) * glow;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  ngOnInit() {
    this.initThree();
    this.animate();
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.renderer.dispose();
  }

  private initThree() {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true
    });
    
    this.uniforms = {
      time: { value: 0 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    
    this.handleResize();
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.uniforms['time'].value += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
} 