import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task, TaskWithSubTasks } from '../task.model';
import { TaskService } from '../task.service';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { standardListAnimation } from '../../../ui/animations/standard-list.ani';
import { expandAnimation } from '../../../ui/animations/expand.ani';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [standardListAnimation, expandAnimation],

})
export class TaskListComponent implements OnDestroy, OnInit {
  @Input() set tasks(tasks: TaskWithSubTasks[]) {
    this.tasks_ = tasks;
    this.doneTasksLength = this.tasks_.filter(task => task.isDone).length;
    this.allTasksLength = this.tasks_.length;
    this.undoneTasksLength = this.tasks_.length - this.doneTasksLength;
  }

  tasks_: TaskWithSubTasks[];

  @Input() filterArgs: string;
  @Input() parentId: string;
  @Input() listId: string;
  @Input() isHideDone: boolean;
  @Input() isHideAll: boolean;
  @Input() listModelId: string;
  @ViewChild('listEl') listEl;
  subs = new Subscription();
  isBlockAni = true;
  doneTasksLength = 0;
  undoneTasksLength = 0;
  allTasksLength = 0;

  private _blockAnimationTimeout: number;

  constructor(
    private _taskService: TaskService,
    private _dragulaService: DragulaService,
    private _cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    // block initial animation (method could be also used to set an initial animation)
    this._blockAnimation();

    this.subs.add(this._dragulaService.dropModel(this.listId)
      .subscribe((params: any) => {
        const {target, source, targetModel, item} = params;
        if (this.listEl.nativeElement === target) {
          this._blockAnimation();

          const sourceModelId = source.dataset.id;
          const targetModelId = target.dataset.id;
          const targetNewIds = targetModel.map((task) => task.id);
          const movedTaskId = item.id;
          this._taskService.move(movedTaskId, sourceModelId, targetModelId, targetNewIds);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this._blockAnimationTimeout) {
      clearTimeout(this._blockAnimationTimeout);
    }
  }

  trackByFn(i: number, task: Task) {
    return task.id;
  }

  expandDoneTasks() {
    this._taskService.showSubTasks(this.parentId);
    this._taskService.focusTask(this.parentId);
  }

  private _blockAnimation() {
    this.isBlockAni = true;
    this._cd.detectChanges();
    this._blockAnimationTimeout = window.setTimeout(() => {
      this.isBlockAni = false;
      this._cd.detectChanges();
    });
  }
}