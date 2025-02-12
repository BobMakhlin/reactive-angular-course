import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {concatMap, finalize, tap} from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // No way to emit via Observable, only subscribing.
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUtilCompleted$<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.start()),
      concatMap(() => obs$), // Subscribe to obs$
      finalize(() => this.stop())
    );
  }

  start(): void {
    this.loadingSubject.next(true);
  }

  stop(): void {
    this.loadingSubject.next(false);
  }
}
