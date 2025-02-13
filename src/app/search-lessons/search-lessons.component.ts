import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from "../services/courses.service";


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;
  activeLesson: Lesson;

  constructor(private coursesService: CoursesService,
              private cd: ChangeDetectorRef) {


  }

  ngOnInit() {


  }

  onSearch(value: string) {
    console.log('value', value);
    this.searchResults$ = this.coursesService.searchLessons$(value);
  }

  onLessonClick(lesson: Lesson) {
    this.activeLesson = lesson;
    this.cd.markForCheck();
  }

  onBackToSearch() {
    this.activeLesson = null;
    this.cd.markForCheck();
  }
}











