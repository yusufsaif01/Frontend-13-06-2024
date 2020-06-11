import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddFootPlayerTableConfig } from './add-footplayer-table-conf';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FootPlayerService } from '../foot-player.service';
import { untilDestroyed } from '@app/core';
import { environment } from '@env/environment';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-footplayer',
  templateUrl: './add-footplayer.component.html',
  styleUrls: ['./add-footplayer.component.scss']
})
export class AddFootplayerComponent implements OnInit, OnDestroy {
  // TABLE CONFIG
  public tableConfig: AddFootPlayerTableConfig = new AddFootPlayerTableConfig();
  public dataSource = new MatTableDataSource([]);

  own_member_type: string;
  findPlayerForm: FormGroup;
  environment = environment;
  show_count: number;
  total_count: number;
  pageSize: number = 5;
  selectedPage: number = 1;
  totalRecordSubject$ = new Subject();

  constructor(
    private _footPlayerService: FootPlayerService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddFootplayerComponent>,
    private _toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.createForm();
    this.own_member_type = data.member_type;
  }
  ngOnDestroy() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {}

  findPlayer() {
    this._footPlayerService
      .findPlayer(this.findPlayerForm.value)
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          let records = response.data.records;
          for (let i = 0; i < records.length; i++) {
            records[i]['avatar'] = environment.mediaUrl + records[i]['avatar'];
          }
          if (response.data.total) {
            this.totalRecordSubject$.next(false);
          } else {
            this.totalRecordSubject$.next(true);
          }

          this.dataSource = new MatTableDataSource(records);
          this.show_count = response.data.records.length;
          this.total_count = response.data.total;
          if (!response.data.total) {
            this._toastrService.error('No player found', 'Find Player');
          }
        },
        error => {
          this._toastrService.error(`${error.error.message}`, 'Find Player');
        }
      );
  }

  sendFootPlayerRequest(user_id: string) {
    this._footPlayerService
      .sendFootPlayerRequest({ to: user_id })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this._toastrService.success(`Success`, 'Send request successfully');
        },
        error => {
          this._toastrService.error(
            `${error.error.message}`,
            'Request Footplayer'
          );
        }
      );
  }

  sendFootPlayerInvite() {
    let formValues = this.findPlayerForm.value;
    Object.keys(formValues).forEach(
      key => formValues[key] == '' && delete formValues[key]
    );
    this._footPlayerService
      .sendFootPlayerInvite(formValues)
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this._toastrService.success('Success', 'Send invite successfully');
        },
        error => {
          this._toastrService.error(
            `${error.error.message}`,
            'Invite Footplayer'
          );
        }
      );
  }

  getStateToolTip(
    is_verified: boolean,
    club_name: string,
    member_type: string
  ) {
    if (['club', 'academy'].includes(member_type)) {
      return { message: 'These details are for club/ academy', state: true };
    } else if (
      is_verified &&
      (!club_name || this.own_member_type == 'academy')
    ) {
      return { message: 'ADD', state: false };
    } else if (is_verified && club_name) {
      return {
        message: `This player is already a member of ${club_name}`,
        state: true
      };
    } else if (!is_verified) {
      return {
        message: 'These details are for not-verified player',
        state: true
      };
    }
  }

  createForm() {
    this.findPlayerForm = this._formBuilder.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]+$/)
        ]
      ]
    });
  }
}
