import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Workday } from 'src/app/shared/models/workday';
import { Task } from 'src/app/shared/models/task';
import { ToastrService } from './toastr.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private dateService: DateService,
    private errorService: ErrorService,
    private loaderService: LoaderService) { }

  save(workday: Workday) {
    // TODO : Pousser la journée de travail passé en paramètre au Firestore.
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday); // C'est cette ligne qui est un peu plus costaud que d'habitude...

    this.loaderService.setLoading(true);
    return this.http.post(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été enregistré avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  update(workday: Workday) {
    // tslint:disable-next-line:max-line-length
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}&currentDocument.exists=true`;
    const data = this.getWorkdayForFirestore(workday);

    return this.http.patch(url, data, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été sauvegardé avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  remove(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays/${workday.id}?key=${environment.firebase.apiKey}`;

    return this.http.delete(url, {}).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été supprimé avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getWorkdayByDate(date: string, userId: string): Observable<Workday|null> {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getSructuredQuery(date, userId);

    return this.http.post(url, data, {}).pipe(
      switchMap((data: any) => {
        const document = data[0].document;
        if (!document) {
          return of(null);
        }
        return of(this.getWorkdayFromFirestore(document.name, document.fields));
      })
    );
  }

  getWorkdayByUser(userId: string): any {
    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayByUserQuery(userId);

    return this.http.post(url, data, {}).pipe(
      switchMap((workdaysData: any) => {
        const workdays: Workday[] = [];
        workdaysData.forEach(data => {
          if (data && data.document) {
            const workday: Workday = this.getWorkdayFromFirestore(data.document.name, data.document.fields);
            workdays.push(workday);
          }
        });
        console.log(workdays);
        return of(workdays);
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }

  private getWorkdayForFirestore(workday: Workday): Object {
    const dueDate: number = new Date(workday.dueDate).getTime(); // date => dueDate
    // tslint:disable-next-line:max-line-length
    const displayDate: string = this.dateService.getDisplayDate(new Date(workday.dueDate)); // La nouvelle propriété displayDate est prise en compte.
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

    return {
      fields: {
        dueDate: { integerValue: dueDate },
        displayDate: { stringValue: displayDate },
        tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }
      }
    };
  }

  // Mise en place de la liste des tâches d'une journée de travail, pour le Firestore.
  private getTaskListForFirestore(tasks: Task[]): any {
    const taskList = {
      arrayValue: {
        values: []
      }
    };

    tasks.forEach(task => {
      taskList.arrayValue.values.push(this.getTaskForFirestore(task));
    });

    return taskList;
  }

  private getTaskForFirestore(task: Task): any {
    return {
      mapValue: {
        fields: {
          title: { stringValue: task.title },
          todo: { integerValue: task.todo },
          done: { integerValue: task.done },
          completed: { booleanValue: false }
        }
      }
    };
  }

  private getSructuredQuery(date: string, userId: string): Object {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'compositeFilter': {
            'op': 'AND',
            'filters': [
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'displayDate' },
                  'op': 'EQUAL',
                  'value': { 'stringValue': date }
                }
              },
              {
                'fieldFilter': {
                  'field': { 'fieldPath': 'userId' },
                  'op': 'EQUAL',
                  'value': { 'stringValue': userId }
                }
              }
            ]
          }
        },
        'limit': 1
      }
    };
  }

  private getWorkdayFromFirestore(name, fields): Workday {
    const tasks: Task[] = [];
    const workdayId: string = name.split('/')[6];

    fields.tasks.arrayValue.values.forEach(data => {
      const task: Task = new Task({
        completed: data.mapValue.fields.completed.booleanValue,
        done: data.mapValue.fields.done.integerValue,
        title: data.mapValue.fields.title.stringValue,
        todo: data.mapValue.fields.todo.integerValue
      });
      tasks.push(task);
    });

    return new Workday({
      id: workdayId,
      userId: fields.userId.stringValue,
      notes: fields.notes.stringValue,
      displayDate: fields.displayDate.stringValue,
      dueDate: fields.dueDate.integerValue,
      tasks: tasks
    });
  }

  private getWorkdayByUserQuery(userId: string): Object {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'fieldFilter': {
            'field': { 'fieldPath': 'userId' },
            'op': 'EQUAL',
            'value': { 'stringValue': userId }
          }
        },
        "orderBy": [{
          "field": {
            "fieldPath": "dueDate"
          },"direction": "DESCENDING"
        }]
      }
    };
  }
}
