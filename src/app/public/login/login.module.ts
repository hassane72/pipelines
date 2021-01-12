import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
// Importez ce module :
import { LoginRoutingModule } from './login-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent],
  imports: [
    SharedModule,
    LoginRoutingModule // Et Ajoutez-le !
  ]
})
export class LoginModule { }
