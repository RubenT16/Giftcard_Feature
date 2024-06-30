import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // if control is empty return no error
      }

      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const errors: any = {};
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[\W_]+/.test(value);

    if (!hasUpperCase) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }

    if (!hasLowerCase) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }

    if (!hasNumeric) {
      errors.numeric = 'Password must contain at least one number';
    }

    if (!hasSpecial) {
      errors.special = 'Password must contain at least one special character';
    }

    return Object.keys(errors).length ? errors : null;
  }

  static matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repeatedPassword = control.get('repeated_password');

    if (password && repeatedPassword && password.value !== repeatedPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
