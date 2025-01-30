import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../../core/services/github.service';
import { Repository } from '../../core/models/repository.model';
import { ShinyTextComponent } from '../../shared/components/shiny-text/shiny-text.component';
import { LoadingAnimationComponent } from '../../shared/components/loading-animation/loading-animation.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import gsap from 'gsap';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, ShinyTextComponent, LoadingAnimationComponent],
  template: `
    <div class="min-h-screen bg-[#0a0c10] relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-1/2 -right-1/2 w-[100rem] h-[100rem] bg-gradient-to-b from-blue-900/10 to-purple-900/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-1/2 -left-1/2 w-[100rem] h-[100rem] bg-gradient-to-t from-purple-900/10 to-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative" #pageContent>
        <div class="container mx-auto px-4 py-8">
          <button
            (click)="goBack()"
            class="group flex items-center space-x-2 mb-8 text-gray-400 hover:text-gray-300 transition-colors"
            @fadeInLeft
          >
            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Back to Search</span>
          </button>

          @if (loading) {
            <div class="flex justify-center items-center py-12" @fadeIn>
              <app-loading-animation />
            </div>
          }

          @if (!loading && repository) {
            <div class="bg-[#0d1117] backdrop-blur-xl border border-gray-800/50 rounded-xl p-8" @fadeIn>
              <!-- Header -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-6 mb-8" @fadeInUp>
                <!-- Repository Info - Mobile -->
                <div class="flex items-start gap-4 sm:hidden">
                  <img
                    [src]="repository.owner.avatarUrl"
                    [alt]="repository.owner.login"
                    class="w-16 h-16 rounded-xl ring-2 ring-gray-800 transform hover:scale-105 transition-transform shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <h1 class="text-2xl font-bold text-gray-200 mb-2 line-clamp-2">
                      <app-shiny-text [text]="repository.name" [speed]="4" />
                    </h1>
                    <p class="text-base text-gray-500">by {{ repository.owner.login }}</p>
                  </div>
                </div>

                <!-- Repository Info - Desktop -->
                <div class="hidden sm:flex sm:items-center sm:flex-1">
                  <img
                    [src]="repository.owner.avatarUrl"
                    [alt]="repository.owner.login"
                    class="w-20 h-20 rounded-xl ring-2 ring-gray-800 transform hover:scale-105 transition-transform"
                  />
                  <div class="ml-6">
                    <h1 class="text-3xl font-bold text-gray-200 mb-2">
                      <app-shiny-text [text]="repository.name" [speed]="4" />
                    </h1>
                    <p class="text-lg text-gray-500">by {{ repository.owner.login }}</p>
                  </div>
                </div>

                <!-- GitHub Link Button -->
                <a
                  [href]="repository.htmlUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-800 to-purple-800 text-gray-300 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-900/25 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-[#0a0c10] group"
                >
                  View on GitHub
                  <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>

              <!-- Description -->
              <p class="text-gray-400 text-lg mb-8 leading-relaxed" @fadeInUp>
                {{ repository.description || 'No description available' }}
              </p>

              <!-- Stats -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" @staggerAnimation>
                <div class="bg-gray-800/20 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 transform hover:scale-[1.02] transition-transform">
                  <div class="flex items-center gap-3 mb-2">
                    <svg class="w-5 h-5 text-amber-500/60" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <h3 class="text-sm font-medium text-gray-400">Stars</h3>
                  </div>
                  <p class="text-2xl font-semibold text-gray-300">{{ repository.stars }}</p>
                </div>

                <div class="bg-gray-800/20 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 transform hover:scale-[1.02] transition-transform">
                  <div class="flex items-center gap-3 mb-2">
                    <svg class="w-5 h-5 text-purple-400/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 4.5A2.5 2.5 0 1 1 12.5 2 2.5 2.5 0 0 1 15 4.5zm-.13 0a2.5 2.5 0 0 1-4.74 0A2.5 2.5 0 0 1 15 4.5zM12 7.5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 6 7.5v9.89a2.5 2.5 0 1 0 2 0V7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9.89a2.5 2.5 0 1 0 2 0zm-2.5-4.5a4.5 4.5 0 0 0-4.5 4.5v9.89a2.5 2.5 0 1 0 2 0V7.5a2.5 2.5 0 0 1 2.5-2.5h1a2.5 2.5 0 0 1 2.5 2.5v9.89a2.5 2.5 0 1 0 2 0V7.5A4.5 4.5 0 0 0 11.5 3z"/>
                    </svg>
                    <h3 class="text-sm font-medium text-gray-400">Forks</h3>
                  </div>
                  <p class="text-2xl font-semibold text-gray-300">{{ repository.forks }}</p>
                </div>

                <div class="bg-gray-800/20 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 transform hover:scale-[1.02] transition-transform">
                  <div class="flex items-center gap-3 mb-2">
                    <svg class="w-5 h-5 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-sm font-medium text-gray-400">Open Issues</h3>
                  </div>
                  <p class="text-2xl font-semibold text-gray-300">{{ repository.openIssues }}</p>
                </div>
              </div>

              <!-- Details and Topics -->
              <div class="border-t border-gray-800/50 pt-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Details -->
                  <div @fadeInLeft>
                    <h3 class="text-lg font-semibold text-gray-300 mb-4">Details</h3>
                    <dl class="space-y-4">
                      <div class="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 transform hover:scale-[1.02] transition-transform">
                        <dt class="text-sm text-gray-500 mb-1">Language</dt>
                        <dd class="text-gray-300">{{ repository.language || 'Not specified' }}</dd>
                      </div>
                      <div class="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 transform hover:scale-[1.02] transition-transform">
                        <dt class="text-sm text-gray-500 mb-1">License</dt>
                        <dd class="text-gray-300">{{ repository.license || 'Not specified' }}</dd>
                      </div>
                      <div class="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 transform hover:scale-[1.02] transition-transform">
                        <dt class="text-sm text-gray-500 mb-1">Created</dt>
                        <dd class="text-gray-300">{{ repository.createdAt | date }}</dd>
                      </div>
                      <div class="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 transform hover:scale-[1.02] transition-transform">
                        <dt class="text-sm text-gray-500 mb-1">Last Updated</dt>
                        <dd class="text-gray-300">{{ repository.updatedAt | date }}</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Topics -->
                  @if (repository.topics && repository.topics.length > 0) {
                    <div @fadeInRight>
                      <h3 class="text-lg font-semibold text-gray-300 mb-4">Topics</h3>
                      <div class="flex flex-wrap gap-2">
                        @for (topic of repository.topics; track topic) {
                          <span class="px-3 py-1.5 bg-blue-900/20 text-blue-400/90 border border-blue-800/20 rounded-full text-sm transform hover:scale-105 transition-transform cursor-default">
                            {{ topic }}
                          </span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (!loading && error) {
            <div class="text-center py-12" @fadeIn>
              <div class="bg-[#0d1117] backdrop-blur-xl border border-gray-800/50 rounded-xl p-8 max-w-lg mx-auto">
                <div class="bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-red-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-red-400 text-lg mb-4">{{ error }}</p>
                <button
                  (click)="goBack()"
                  class="px-6 py-3 bg-gradient-to-r from-blue-800 to-purple-800 text-gray-300 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-900/25 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-[#0a0c10]"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DetailComponent implements OnInit {
  @ViewChild('pageContent') pageContent!: ElementRef;
  
  repository: Repository | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    // Initialize page animations
    setTimeout(() => this.initPageAnimations(), 0);

    const owner = this.route.snapshot.paramMap.get('owner');
    const repo = this.route.snapshot.paramMap.get('repo');

    if (!owner || !repo) {
      this.error = 'Invalid repository information';
      this.loading = false;
      return;
    }

    this.githubService.getRepositoryDetails(owner, repo).subscribe({
      next: (repository) => {
        this.repository = repository;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load repository details';
        this.loading = false;
      }
    });
  }

  private initPageAnimations(): void {
    gsap.from(this.pageContent.nativeElement, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  async goBack(): Promise<void> {
    // Animate out
    await gsap.to(this.pageContent.nativeElement, {
      duration: 0.5,
      opacity: 0,
      y: -30,
      ease: 'power3.in'
    });

    // Navigate
    this.router.navigate(['/']);
  }
} 