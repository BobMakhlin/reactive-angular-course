import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Course, sortCoursesBySeqNo} from "../model/course";
import {catchError, map, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {MessagesService} from "../messages/messages.service";
import {LoadingService} from "../loading/loading.service";

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  private courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(private httpClient: HttpClient,
              private loadingService: LoadingService,
              private messagesService: MessagesService) {
    this.loadAllCourses();
  }

  filterByCategory$(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo)
      ));
  }

  saveCourse$(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse: Course = {...courses[index], ...changes};
    const newCourses: Course[] = [...courses];
    newCourses[index] = newCourse;
    this.subject.next(newCourses);

    return this.httpClient.put(`/api/courses/${courseId}`, changes).pipe(
      catchError(error => {
        const message = 'Could not save course';
        console.log(message, error);
        this.messagesService.showErrors(message);
        return throwError(error);
      }),
      shareReplay()
    );
  }

  private loadAllCourses() {
    const loadCourses$ = this.httpClient.get<Course[]>('/api/courses').pipe(
      map(res => res["payload"]),
      catchError(error => {
        const message = 'Could not load courses';
        this.messagesService.showErrors(message);
        console.log(message, error);
        return throwError(error);
      }),
      tap(courses => this.subject.next(courses))
    );
    this.loadingService.showLoaderUtilCompleted$(loadCourses$).subscribe(() => console.log('Courses loaded'));
  }
}
