import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import shortid from 'shortid';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TaskListComponent implements OnInit, OnDestroy {
  @Input() tasks: Task[];
  @Input() filterArgs: string;
  @Input() connectedList: any;
  taskListId: string;

  constructor(private _taskService: TaskService) {
  }

  ngOnInit() {
    this.taskListId = shortid();
  }

  ngOnDestroy() {
  }

  drop(ev) {
    // console.log(ev.previousIndex,
    //   this.tasks[ev.previousIndex].title,
    //   ev.currentIndex,
    //   this.tasks[ev.currentIndex].title);

    this._taskService.move(
      this.tasks[ev.previousIndex].id,
      this.tasks[ev.currentIndex].id,
      ev.previousIndex < ev.currentIndex
    );
  }

  trackByFn(i: number, task: Task) {
    return task.id;
  }

  focusLastFocusedTaskEl() {
  }
}
