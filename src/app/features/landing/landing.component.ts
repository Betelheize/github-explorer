import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { GithubService } from '../../core/services/github.service';
import { Repository } from '../../core/models/repository.model';
import { RepositoryCardComponent } from '../../shared/components/repository-card/repository-card.component';
import { RepositoryTableComponent } from '../../shared/components/repository-table/repository-table.component';
import { ShinyTextComponent } from '../../shared/components/shiny-text/shiny-text.component';
import { LoadingAnimationComponent } from '../../shared/components/loading-animation/loading-animation.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import gsap from 'gsap';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RepositoryCardComponent,
    RepositoryTableComponent,
    ShinyTextComponent,
    LoadingAnimationComponent
  ],
  template: `
    <div class="min-h-screen bg-[#0a0c10] relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-1/2 -right-1/2 w-[100rem] h-[100rem] bg-gradient-to-b from-blue-900/10 to-purple-900/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-1/2 -left-1/2 w-[100rem] h-[100rem] bg-gradient-to-t from-purple-900/10 to-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative" #pageContent>
        <!-- Hero Section -->
        <div class="container mx-auto px-4 py-16">
          <div class="text-center mb-12" @fadeInUp>
            <div class="mb-6">
              <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                <app-shiny-text 
                  text="GitHub Repository" 
                  [speed]="4"
                  className="mr-2"
                />
                <app-shiny-text 
                  text="Explorer" 
                  [speed]="3"
                />
              </h1>
              <p class="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
                Discover millions of open source projects.
              </p>
            </div>
            
            <!-- Search Section -->
            <div class="max-w-3xl mx-auto mt-12">
              <div class="relative">
                <div class="flex items-center justify-center space-x-2">
                  <div class="flex-1 relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-800/50 to-purple-800/50 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur group-hover:blur-md"></div>
                    <div class="relative flex items-center bg-[#0d1117] backdrop-blur-xl rounded-full border border-gray-800/50">
                      <!-- Search Icon -->
                      <div class="absolute left-4 sm:left-6 text-gray-600">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                      <input
                        [formControl]="searchControl"
                        type="text"
                        placeholder="Search repositories..."
                        class="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 bg-transparent text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-0 text-base sm:text-lg rounded-full"
                      />
                      @if (loading) {
                        <div class="absolute right-4 sm:right-6">
                          <app-loading-animation />
                        </div>
                      }
                    </div>
                  </div>
                  
                  <!-- View Toggle Button -->
                  <button
                    (click)="toggleView()"
                    class="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-800 to-purple-800 text-gray-300 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-[#0a0c10] hover:from-blue-700 hover:to-purple-700"
                    aria-label="Toggle view"
                  >
                    @if (isCardView) {
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                    } @else {
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="mt-12" #resultsContainer>
            @if (!loading && repositories.length === 0 && searchControl.value) {
              <div class="text-center py-12" @fadeIn>
                <p class="text-gray-500 text-lg">No repositories found matching your search.</p>
              </div>
            }

            @if (!loading && repositories.length > 0) {
              @if (isCardView) {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" @staggerAnimation>
                  @for (repo of repositories; track repo.id) {
                    <app-repository-card
                      [repository]="repo"
                      (click)="navigateToDetail(repo)"
                      class="repository-card transform transition-all duration-300 hover:scale-[1.02]"
                      @fadeInUp
                    />
                  }
                </div>
              } @else {
                <div class="bg-[#0d1117] backdrop-blur-xl rounded-xl border border-gray-800/50 overflow-hidden" @fadeIn>
                  <app-repository-table
                    [repositories]="repositories"
                    (rowClick)="navigateToDetail($event)"
                  />
                </div>
              }
            }

            <!-- Empty State -->
            @if (!loading && repositories.length === 0 && !searchControl.value) {
              <div class="text-center py-16" @fadeIn>
                <div class="bg-[#0d1117] backdrop-blur-xl rounded-xl border border-gray-800/50 p-8 max-w-lg mx-auto">
                  <div class="bg-gradient-to-r from-blue-800 to-purple-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <p class="text-xl text-gray-300 mb-2">Start Your Search</p>
                  <p class="text-gray-500">Try searching for "react", "tensorflow", or your favorite technology</p>
                </div>
              </div>
            }

            <!-- Loading More Indicator -->
            @if (loadingMore) {
              <div class="flex justify-center items-center py-8" @fadeIn>
                <app-loading-animation />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep .repository-card {
      transform-origin: center;
      will-change: transform;
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
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('pageContent') pageContent!: ElementRef;
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;
  
  searchControl = new FormControl('');
  repositories: Repository[] = [];
  loading = false;
  loadingMore = false;
  isCardView = true;
  currentPage = 1;
  hasMoreResults = true;
  private destroy$ = new Subject<void>();

  constructor(
    private githubService: GithubService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.resultsContainer) return;

    const rect = this.resultsContainer.nativeElement.getBoundingClientRect();
    const bottomOffset = rect.bottom - window.innerHeight;

    if (bottomOffset < 200 && !this.loading && !this.loadingMore && this.hasMoreResults && this.searchControl.value) {
      this.loadMore();
    }
  }

  ngOnInit(): void {
    // Handle query parameter
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['q']) {
        this.searchControl.setValue(params['q'], { emitEvent: false });
        this.searchRepositories(params['q']);
      }
    });

    // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query) {
        this.currentPage = 1;
        this.hasMoreResults = true;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: query },
          queryParamsHandling: 'merge'
        });
        this.searchRepositories(query);
      } else {
        this.repositories = [];
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize page animations after view is ready
    this.initPageAnimations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initPageAnimations(): void {
    if (this.pageContent?.nativeElement) {
      gsap.from(this.pageContent.nativeElement, {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: 'power3.out'
      });
    }
  }

  private searchRepositories(query: string, page: number = 1): void {
    if (page === 1) {
      this.loading = true;
      this.repositories = [];
    } else {
      this.loadingMore = true;
    }

    this.githubService.searchRepositories(query, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (repos) => {
          if (repos.length === 0) {
            this.hasMoreResults = false;
          }
          
          if (page === 1) {
            this.repositories = repos;
          } else {
            this.repositories = [...this.repositories, ...repos];
          }
          this.loading = false;
          this.loadingMore = false;
        },
        error: () => {
          this.loading = false;
          this.loadingMore = false;
          this.hasMoreResults = false;
        }
      });
  }

  private loadMore(): void {
    if (this.searchControl.value) {
      this.currentPage++;
      this.searchRepositories(this.searchControl.value, this.currentPage);
    }
  }

  toggleView(): void {
    this.isCardView = !this.isCardView;
  }

  async navigateToDetail(repo: Repository): Promise<void> {
    // Animate out
    await gsap.to(this.pageContent.nativeElement, {
      duration: 0.5,
      opacity: 0,
      y: -30,
      ease: 'power3.in'
    });

    // Navigate
    this.router.navigate(['/detail', repo.owner.login, repo.name]);
  }
} 