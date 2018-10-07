import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { Store } from '@ngrx/store';
import { select } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { TaskActionTypes } from './store/task.actions';
import { selectAllTasks, selectCurrentTask, selectTaskIds } from './store/task.selectors';
import shortid from 'shortid';
import { LS_TASK } from './task.const';
import { loadFromLs } from '../util/local-storage';


@Injectable()
export class TaskService {
  currentTaskId$: Observable<string> = this._store.pipe(select(selectCurrentTask));
  tasks$: Observable<Task[]> = this._store.pipe(select(selectAllTasks));
  tasksId$: Observable<string[] | number[]> = this._store.pipe(select(selectTaskIds));
  undoneTasks$: Observable<Task[]> = this.tasks$.map((tasks) => tasks && tasks.filter((task: Task) => !task.isDone));
  doneTasks$: Observable<Task[]> = this.tasks$.map((tasks) => tasks && tasks.filter((task: Task) => task.isDone));

  constructor(
    private _store: Store<any>
  ) {
    this.loadStateFromLS();
    this.tasksId$.subscribe((val) => console.log(val));
  }

  // META
  // ----
  loadStateFromLS() {
    const lsTaskState = loadFromLs(LS_TASK);

    this._store.dispatch({
      type: TaskActionTypes.LoadState,
      payload: {
        state: lsTaskState,
      }
    });
  }

  setCurrentTask(taskId: string) {
    this._store.dispatch({
      type: TaskActionTypes.SetCurrentTask,
      payload: taskId,
    });
  }

  pauseCurrentTask() {
    this._store.dispatch({
      type: TaskActionTypes.UnsetCurrentTask,
    });
  }

  // Tasks
  // -----
  addTask(title: string) {
    this._store.dispatch({
      type: TaskActionTypes.AddTask,
      payload: {
        task: {
          title,
          id: shortid(),
          isDone: false
        }
      }
    });
  }

  deleteTask(taskId: string) {
    this._store.dispatch({
      type: TaskActionTypes.DeleteTask,
      payload: {id: taskId}
    });
  }


  updateTask(taskId: string, changedFields: Partial<Task>) {
    this._store.dispatch({
      type: TaskActionTypes.UpdateTask,
      payload: {
        task: {
          id: taskId,
          changes: changedFields
        }
      }
    });
  }

  setTaskDone(taskId: string) {
    this.updateTask(taskId, {isDone: true});
  }

  setTaskUnDone(taskId: string) {
    this.updateTask(taskId, {isDone: false});
  }


  moveAfter(taskId, targetItemId: string | undefined) {
    this._store.dispatch({
      type: TaskActionTypes.MoveAfter,
      payload: {
        taskId,
        targetItemId,
      }
    });
  }

  addSubTask(parentTask: Task) {
    // this._store.dispatch({
    //   type: TaskActionTypes.AddSubTask,
    //   payload: parentTask
    // });
  }
}