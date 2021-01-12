import { AbstractControl, ValidatorFn } from '@angular/forms';

// @ts-ignore
export function IsDateValidator(control: AbstractControl): ValidatorFn {
  // tslint:disable-next-line:no-unused-expression
  // @ts-ignore
  // tslint:disable-next-line:no-unused-expression
  new Date(control.value) !== 'Invalid Date' && !isNaN(new Date(control.value)) ? { isDate: true } : null;
}
