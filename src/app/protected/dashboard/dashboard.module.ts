import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
// Ajoutez cette importation :
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    // Et importez le module de route du tableau de bord :
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
