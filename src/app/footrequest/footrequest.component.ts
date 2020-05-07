import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MutualFootmateComponent } from './mutual-footmate/mutual-footmate.component';

@Component({
  selector: 'app-footrequest',
  templateUrl: './footrequest.component.html',
  styleUrls: ['./footrequest.component.scss']
})
export class FootrequestComponent implements OnInit {
  panelOptions: object = {
    bio: true,
    member_type: true,
    my_achievements: false,
    view_profile_link: false,
    player_type: true,
    follows_buttons: false
  };

  constructor(public dialog: MatDialog) {}
  // MatualFootmates
  openDialog(): void {
    const dialogRef = this.dialog.open(MutualFootmateComponent, {
      width: '40%',
      panelClass: 'MatualFootmate'
    });
  }
  ngOnInit() {}
}
