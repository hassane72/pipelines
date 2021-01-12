import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Workday } from 'src/app/shared/models/workday';
import { filter } from 'rxjs/operators';
import {AuthService} from '../../../core/services/auth.service';
import {WorkdaysService} from '../../../core/services/workdays.service';

@Component({
  selector: 'al-planning-workday-list',
  templateUrl: './planning-workday-list.component.html',
  styles: []
})
export class PlanningWorkdayListComponent implements OnInit {
  workdays$: Observable<Workday>;

  constructor(
    private authService: AuthService,
    private workdaySerice: WorkdaysService) { }

  ngOnInit() {
    const id: string = this.authService.currentUser.id;
    this.workdays$ = this.workdaySerice.getWorkdayByUser(id);
  }

  onWorkdayRemoved(workday: Workday) {
    this.workdaySerice.remove(workday)
      .subscribe(_ => {
        this.workdays$ = this.workdays$.pipe(
          filter(currentWorkday => currentWorkday.id != workday.id)
        );
      });
  }

}
