import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { matchingPassword } from '@app/shared/validators/matchingPassword';
import { untilDestroyed } from '@app/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  token: string;
  userId: string;
  isLinkExpired: boolean = false;
  tooltip: string =
    'Please provide at least 1 special character, 1 number and 1 alphabet';

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastrService: ToastrService
  ) {
    this.createForm();
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    console.log('user id is=>', this.userId);
    //  this._authenticationService
    //    .resetLinkStatus(this.token)
    //    .pipe(untilDestroyed(this))
    //    .subscribe(
    //      response => {
    //        if (response.status === 'success') {
    //          this.isLinkExpired = true;
    //       }
    //     },
    //     error => {
    // if (error.error.code === 'LINK_EXPIRED' || error.error.code === 'INVALID_TOKEN')
    //       this._router.navigate(['/link-expired']);
    //     }
    //   );
  }

  resetPassword() {
    const userdata = localStorage.getItem('userId');

    console.log('form value is=>', this.resetPasswordForm.value);
    this._authenticationService
      .resetPassword(this.resetPasswordForm.value, userdata)
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this._toastrService.success('Success', 'Password reset');
          this._router.navigate(['/login']);
        },
        error => {
          this._toastrService.error(
            `${error.error.message}`,
            'Password Reset Failed'
          );
        }
      );
  }

  createForm() {
    const userid = localStorage.getItem('userId');
    this.resetPasswordForm = this._formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\\\|\:\;\'\"\,\.\<\>\/\?])/
            )
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\\\|\:\;\'\"\,\.\<\>\/\?])/
            )
          ]
        ],
        userid: [userid]
      },
      {
        validator: matchingPassword
      }
    );
  }
}
