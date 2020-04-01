import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  constructor(
    private _formBuilder           : FormBuilder,
    private _authenticationService : AuthenticationService,
    private _toastrService         : ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  isFocused(form: FormGroup, field: string) {
    const { invalid, touched } = form.get(field);
    return invalid && touched;
  }

  isRequired(form: FormGroup, field: string) {
    const { required } = form.get(field).errors;
    return required;
  }

  forgetPassword() {
    console.log('form data', this.forgetPasswordForm.value);
    this._authenticationService
      .forgetPassword(this.forgetPasswordForm.value)
      .subscribe(
        response => {
          console.log('response data', response);
          this._toastrService.success('Successful','Reset Link Sent')    
        },
        error => {
          console.log('err', error);
          this._toastrService.error(`${error.error.message}`,'Failed')
        }
      );
  }

  createForm() {
    this.forgetPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
}