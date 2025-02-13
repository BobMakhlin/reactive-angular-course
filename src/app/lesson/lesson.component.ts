import {Component, Input} from '@angular/core';
import {Lesson} from "../model/lesson";

@Component({
  selector: 'lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  standalone: false
})
export class LessonComponent {
  @Input() lesson: Lesson;


}
