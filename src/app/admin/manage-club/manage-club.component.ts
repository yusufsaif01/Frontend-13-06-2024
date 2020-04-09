import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageClubTableConfig } from './manage-club-table-conf';
import { FilterDialogClubComponent } from '../filter-dialog-club/filter-dialog-club.component';
import { AdminService } from '../service/admin.service';
import { DeleteConfirmationComponent } from '../../shared/dialog-box/delete-confirmation/delete-confirmation.component';
import { StatusConfirmationComponent } from '../../shared/dialog-box/status-confirmation/status-confirmation.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-club',
  templateUrl: './manage-club.component.html',
  styleUrls: ['./manage-club.component.scss']
})
export class ManageClubComponent implements OnInit {
  sideBarToogle: boolean = true;
  showFiller = false;
  list: any;
  pageSize: number = 20;
  totalRecords = 10;
  clubs_count: number;

  public tableConfig: ManageClubTableConfig = new ManageClubTableConfig();
  public dataSource = new MatTableDataSource([]);

  constructor(
    public dialog: MatDialog,
    public adminService: AdminService,
    public toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getClubList(this.pageSize, 1);
  }

  getClubList(page_size: number, page_no: number) {
    this.adminService
      .getClubList({
        page_no: page_no,
        page_size: page_size
      })
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.data.records);
        this.clubs_count = response.data.total;
      });
  }

  recordsPerPage(event: any) {
    this.pageSize = event.target.value;
    this.getClubList(this.pageSize, 1);
  }

  updatePage(event: any) {
    // console.log(event.target.value);
    this.getClubList(this.pageSize, event.selectedPage);
  }

  sampleModel() {
    const dialogRef = this.dialog.open(FilterDialogClubComponent, {
      width: '50% ',
      panelClass: 'filterDialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        if (result['from']) {
          result['from'] = new Date(result['from']).toISOString();
        }
        if (result['to']) {
          result['to'] = new Date(result['to']).toISOString();
        }
        console.log('The dialog was closed');
        this.adminService.getClubList(result).subscribe(response => {
          this.dataSource = new MatTableDataSource(response.data.records);
        });
      } else {
        console.log('filter data not provided');
      }
    });

    this.list = [
      {
        title: 'Yes',
        type: 'ABC',
        quiz_mapped: 'Yes'
      }
    ];
    // this.dataSource = new MatTableDataSource(this.list);
  }

  deletePopup(user_id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('popup closed');
      console.log('result', result);
      if (result === true) {
        this.adminService.deleteUser({ user_id: user_id }).subscribe(
          response => {
            this.toastrService.success(`Success`, 'User deleted successfully');
          },
          error => {
            // log.debug(`Login error: ${error}`);
            console.log('error', error);
            this.toastrService.error(`${error.error.message}`, 'Delete User');
          }
        );
      }
    });
  }

  statusPopup(user_id: string, status: string) {
    const dialogRef = this.dialog.open(StatusConfirmationComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('popup closed');
      console.log('result', result);
      // deactive user not implemented
      if (result === true) {
        if (status === 'active') {
          this.adminService.deactivateUser({ user_id: user_id }).subscribe(
            response => {
              this.toastrService.success(
                `Success`,
                'Status updated successfully'
              );
            },
            error => {
              // log.debug(`Login error: ${error}`);
              console.log('error', error);
              this.toastrService.error(
                `${error.error.message}`,
                'Status update'
              );
            }
          );
        } else if (status === 'blocked') {
          this.adminService.activeUser({ user_id: user_id }).subscribe(
            response => {
              this.toastrService.success(
                `Success`,
                'Status updated successfully'
              );
            },
            error => {
              // log.debug(`Login error: ${error}`);
              console.log('error', error);
              this.toastrService.error(
                `${error.error.message}`,
                'Status update'
              );
            }
          );
        }
      }
    });
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}