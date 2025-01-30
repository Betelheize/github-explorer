import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, shareReplay, catchError, of } from 'rxjs';
import { Repository } from '../models/repository.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';
  private readonly CACHE_SIZE = 100;
  private readonly ITEMS_PER_PAGE = 30;
  private cache = new Map<string, Observable<Repository[]>>();

  constructor(private http: HttpClient) {}

  searchRepositories(query: string, page: number = 1): Observable<Repository[]> {
    const cacheKey = `${query}_${page}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('q', query)
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('per_page', this.ITEMS_PER_PAGE.toString())
      .set('page', page.toString());

    const request = this.http.get<any>(`${this.API_URL}/search/repositories`, { params }).pipe(
      map(response => this.mapRepositories(response.items)),
      shareReplay(1),
      catchError(() => of([]))
    );

    // Cache management
    this.cache.set(cacheKey, request);
    if (this.cache.size > this.CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return request;
  }

  getRepositoryDetails(owner: string, repo: string): Observable<Repository> {
    const cacheKey = `${owner}/${repo}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.pipe(
        map(repos => repos[0])
      );
    }

    const request = this.http.get<any>(`${this.API_URL}/repos/${owner}/${repo}`).pipe(
      map(response => this.mapRepository(response)),
      map(repo => [repo]),
      shareReplay(1),
      catchError(() => of([]))
    );

    this.cache.set(cacheKey, request);
    if (this.cache.size > this.CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return request.pipe(
      map(repos => repos[0])
    );
  }

  private mapRepositories(items: any[]): Repository[] {
    return items.map(item => this.mapRepository(item));
  }

  private mapRepository(item: any): Repository {
    return {
      id: item.id,
      name: item.name,
      fullName: item.full_name,
      description: item.description,
      stars: item.stargazers_count,
      forks: item.forks_count,
      openIssues: item.open_issues_count,
      language: item.language,
      license: item.license?.name,
      topics: item.topics || [],
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      htmlUrl: item.html_url,
      owner: {
        login: item.owner.login,
        avatarUrl: item.owner.avatar_url
      }
    };
  }
} 