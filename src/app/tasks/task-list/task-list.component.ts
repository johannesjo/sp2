import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  taskListId: string;
  private subs: Subscription[] = [];

  constructor(private _taskService: TaskService) {
  }

  ngOnInit() {
    this.taskListId = shortid();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub && sub.unsubscribe());
  }

  trackByFn(i: number, task: Task) {
    return task.id;
  }

  focusLastFocusedTaskEl() {
  }
}
