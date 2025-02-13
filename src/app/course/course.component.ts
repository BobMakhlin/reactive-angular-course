import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {combineLatest, concat, Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from "../services/courses.service";
import {LoadingService} from "../loading/loading.service";
import {map, tap} from "rxjs/operators";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false
})
export class CourseComponent implements OnInit {

  // Single data observable pattern.
  courseData$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));
    const course$ = concat(of(null), this.coursesService.loadCourseById$(courseId));
    const lessons$ = concat(of(null), this.coursesService.loadAllCourseLessons$(courseId));

    // Combine latest emitted values of two observables.
    // [null, null] (since both observables emit null as first val)
    // If courses is loaded faster:
    // [courseObj, null]
    // And when lessons are loaded:
    // [courseObj, lessonsArr]

    this.courseData$ = combineLatest([course$, lessons$]).pipe(
      tap((x) => console.log(x)),
      map(([course, lessons]) => ({course, lessons} as CourseData))
    );

  }


}











