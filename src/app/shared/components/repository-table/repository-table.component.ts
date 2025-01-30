import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Repository } from '../../../core/models/repository.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-repository-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden">
      <table class="w-full">
        <thead class="bg-[#0a0c10]/95 backdrop-blur-xl sticky top-0 z-10">
          <tr class="border-b border-gray-800/50">
            <th class="px-3 sm:px-6 py-3 sm:py-4 text-left">
              <span class="text-gray-500 text-xs sm:text-sm font-medium">Repository</span>
            </th>
            <th class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left">
              <span class="text-gray-500 text-xs sm:text-sm font-medium">Language</span>
            </th>
            <th class="px-3 sm:px-6 py-3 sm:py-4 text-right">
              <span class="text-gray-500 text-xs sm:text-sm font-medium">Stars</span>
            </th>
            <th class="hidden sm:table-cell px-6 py-4 text-right">
              <span class="text-gray-500 text-sm font-medium">Forks</span>
            </th>
            <th class="hidden sm:table-cell px-6 py-4 text-right">
              <span class="text-gray-500 text-sm font-medium">Last Updated</span>
            </th>
          </tr>
        </thead>
        <tbody>
          @for (repo of repositories; track repo.id) {
            <tr 
              class="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors cursor-pointer"
              (click)="rowClick.emit(repo)"
              @fadeInUp
            >
              <td class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="shrink-0">
                    <img 
                      [src]="repo.owner.avatarUrl" 
                      [alt]="repo.owner.login"
                      class="w-6 h-6 sm:w-8 sm:h-8 rounded-lg ring-1 ring-gray-800 transform hover:scale-110 transition-transform"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="text-gray-300 text-sm sm:text-base font-medium hover:text-blue-400 transition-colors truncate">{{ repo.name }}</div>
                    <div class="text-gray-500 text-xs sm:text-sm truncate">{{ repo.owner.login }}</div>
                  </div>
                </div>
              </td>
              <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                @if (repo.language) {
                  <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 sm:w-3 sm:h-3 rounded-full" [style.backgroundColor]="getLanguageColor(repo.language)"></span>
                    <span class="text-gray-400 text-sm sm:text-base">{{ repo.language }}</span>
                  </div>
                } @else {
                  <span class="text-gray-500 text-sm sm:text-base">-</span>
                }
              </td>
              <td class="px-3 sm:px-6 py-3 sm:py-4 text-right">
                <div class="flex items-center justify-end space-x-1 text-gray-400 group">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-amber-500/60 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm sm:text-base group-hover:text-amber-500 transition-colors">{{ formatNumber(repo.stars) }}</span>
                </div>
              </td>
              <td class="hidden sm:table-cell px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-1 text-gray-400 group">
                  <svg class="w-4 h-4 text-purple-400/60 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 4.5A2.5 2.5 0 1 1 12.5 2 2.5 2.5 0 0 1 15 4.5zm-.13 0a2.5 2.5 0 0 1-4.74 0A2.5 2.5 0 0 1 15 4.5zM12 7.5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 6 7.5v9.89a2.5 2.5 0 1 0 2 0V7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9.89a2.5 2.5 0 1 0 2 0zm-2.5-4.5a4.5 4.5 0 0 0-4.5 4.5v9.89a2.5 2.5 0 1 0 2 0V7.5a2.5 2.5 0 0 1 2.5-2.5h1a2.5 2.5 0 0 1 2.5 2.5v9.89a2.5 2.5 0 1 0 2 0V7.5A4.5 4.5 0 0 0 11.5 3z"/>
                  </svg>
                  <span class="group-hover:text-purple-400 transition-colors">{{ formatNumber(repo.forks) }}</span>
                </div>
              </td>
              <td class="hidden sm:table-cell px-6 py-4 text-right">
                <span class="text-gray-500">{{ formatDate(repo.updatedAt) }}</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep tr {
      transform-origin: center;
      will-change: transform, opacity;
    }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryTableComponent {
  @Input() repositories: Repository[] = [];
  @Output() rowClick = new EventEmitter<Repository>();

  private languageColors: { [key: string]: string } = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB'
  };

  getLanguageColor(language: string): string {
    return this.languageColors[language] || '#8b949e';
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years}y ago`;
    }
    if (months > 0) {
      return `${months}mo ago`;
    }
    if (days > 0) {
      return `${days}d ago`;
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return 'just now';
  }
} 