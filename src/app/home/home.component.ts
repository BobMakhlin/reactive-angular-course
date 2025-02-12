import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {CoursesService} from "../services/courses.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {LoadingService} from "../loading/loading.service";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


  constructor(private coursesService: CoursesService,
              private loadingService: LoadingService) {

  }

  ngOnInit() {
    this.loadCourses();

  }

  loadCourses(): void {
    const courses$ = this.coursesService.loadAllCourses$().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo))
    );
    const loadCourses$ = this.loadingService.showLoaderUtilCompleted$(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    );
    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
  }


  onCoursesChanged() {
    this.loadCourses();
  }
}




