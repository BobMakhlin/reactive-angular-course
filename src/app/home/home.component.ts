import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from "rxjs";
import {CoursesStore} from "../services/courses.store";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;


  constructor(private coursesStore: CoursesStore) {

  }

  ngOnInit() {
    this.loadCourses();

  }

  loadCourses(): void {
    this.beginnerCourses$ = this.coursesStore.filterByCategory$('BEGINNER');
    this.advancedCourses$ = this.coursesStore.filterByCategory$('ADVANCED');
  }
}




