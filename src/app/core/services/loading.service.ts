import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly MINIMUM_LOADING_TIME = 800; // Minimum loading time in milliseconds
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;

  loading$: Observable<boolean> = this.loadingSubject.pipe(
    debounceTime(50),
    distinctUntilChanged()
  );

  setLoading(loading: boolean): void {
    if (loading) {
      this.activeRequests++;
      this.loadingSubject.next(true);
    } else {
      timer(this.MINIMUM_LOADING_TIME).subscribe(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loadingSubject.next(false);
        }
      });
    }
  }
} 