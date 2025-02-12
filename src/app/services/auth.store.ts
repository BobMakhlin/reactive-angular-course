import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../model/user";
import {map, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

const AUTH_DATA = 'auth_data';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private http = inject(HttpClient);
  private subject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedOut$ = this.user$.pipe(map(user => !user));
    this.readUserFromLocalStorage();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', {email, password}).pipe(
      tap(user => {
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        this.subject.next(user);
      }),
      shareReplay()
    );
  }

  logout(): void {
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
  }

  private readUserFromLocalStorage(): void {
    const authDataJson = localStorage.getItem(AUTH_DATA);
    if (authDataJson) {
      const user: User = JSON.parse(authDataJson);
      this.subject.next(user);
    }
  }
}
