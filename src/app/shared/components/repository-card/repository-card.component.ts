import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Repository } from '../../../core/models/repository.model';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group h-full bg-gray-900/50 backdrop-blur-xl hover:bg-gray-900/70 border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 cursor-pointer transition-all duration-300">
      <div class="flex items-center mb-4">
        <img
          [src]="repository.owner.avatarUrl"
          [alt]="repository.owner.login"
          class="w-12 h-12 rounded-xl ring-2 ring-gray-800 group-hover:ring-blue-500/50 mr-4 transition-all duration-300"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {{ repository.name }}
          </h3>
          <p class="text-sm text-gray-400">{{ repository.owner.login }}</p>
        </div>
        @if (repository.language) {
          <span class="px-3 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {{ repository.language }}
          </span>
        }
      </div>

      <p class="text-gray-400 mb-6 line-clamp-2 min-h-[3rem] group-hover:text-gray-300 transition-colors">
        {{ repository.description || 'No description available' }}
      </p>

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-yellow-500/80 group-hover:text-yellow-400" title="Stars">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{{ repository.stars }}</span>
          </div>
          <div class="flex items-center gap-2 text-purple-400/80 group-hover:text-purple-400" title="Forks">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 4.5A2.5 2.5 0 1 1 12.5 2 2.5 2.5 0 0 1 15 4.5zm-.13 0a2.5 2.5 0 0 1-4.74 0A2.5 2.5 0 0 1 15 4.5zM12 7.5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 6 7.5v9.89a2.5 2.5 0 1 0 2 0V7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9.89a2.5 2.5 0 1 0 2 0zm-2.5-4.5a4.5 4.5 0 0 0-4.5 4.5v9.89a2.5 2.5 0 1 0 2 0V7.5a2.5 2.5 0 0 1 2.5-2.5h1a2.5 2.5 0 0 1 2.5 2.5v9.89a2.5 2.5 0 1 0 2 0V7.5A4.5 4.5 0 0 0 11.5 3z"/>
            </svg>
            <span>{{ repository.forks }}</span>
          </div>
        </div>
        <div class="flex items-center text-blue-400/80 group-hover:text-blue-400 transition-colors">
          <span class="text-sm">View Details</span>
          <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  `
})
export class RepositoryCardComponent {
  @Input({ required: true }) repository!: Repository;
} 