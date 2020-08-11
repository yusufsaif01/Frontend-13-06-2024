import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageAttributeTableConfig } from './manage-attribute-table-conf';
import { AddpopupComponent } from '../../addpopup/addpopup.component';
import { AdminService } from '@app/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@app/core';

@Component({
  selector: 'app-manage-attribute',
  templateUrl: './manage-attribute.component.html',
  styleUrls: ['./manage-attribute.component.scss']
})
export class ManageAttributeComponent implements OnInit, OnDestroy {
  // table config
  public tableConfig: ManageAttributeTableConfig = new ManageAttributeTableConfig();
  public dataSource = new MatTableDataSource([]);
  editMode: boolean = false;
  attributeId: any;
  abilityId: string;
  abilityName: string = 'Loading...';
  row: any = {};
  update: any = '';

  // sidebar
  public sideBarToggle: boolean = true;
  updateSidebar($event: any) {
    this.sideBarToggle = $event;
  }
  // Add Popup
  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    public toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.abilityId = params['id'];
    });
  }

  ngOnDestroy() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddpopupComponent, {
      width: '40%',
      data: { specialization: 'attribute', ability_id: this.abilityId },
      autoFocus: false
    });
    this.editMode = false;
    this.update = 'cancel';

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getAttributeListByAbility(this.abilityId);
      }
    });
  }
  ngOnInit() {
    this.getAttributeListByAbility(this.abilityId);
  }

  getAttributeListByAbility(ability_id: string) {
    this.adminService
      .getAttributeListByAbility({ ability_id })
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this.abilityName = response.data.ability;
          let records = response.data.records;
          this.dataSource = new MatTableDataSource(records);
        },
        error => {}
      );
  }
  editAttribute(name: any, id: any) {
    let obj = { name, id };
    this.row = obj;
    this.editMode = true;
    this.attributeId = id;
    // this.getAbilityList();
  }
  updateAttribute(name: any, id: any) {
    if (!name || name == '') {
      return;
    }
    this.editMode = false;
    this.update = 'update';
    setTimeout(() => {
      this.update = '';
    }, 1000);
  }
  cancelAttribute(user?: any) {
    this.editMode = false;
    this.update = 'cancel';
    this.getAttributeListByAbility(this.abilityId);
  }
  onChange(event: any) {
    if (event.id) {
      this.updateAttributeById(event);
    }
  }
  updateAttributeById(body: { id: string; name: string }) {
    const { id, name } = body;
    delete body['serialNumber'];
    this.adminService
      .updateAttributeById({
        name: name,
        ability_id: this.abilityId,
        attribute_id: id
      })
      .pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.toastrService.success(
            `Success`,
            'Attribute updated successfully'
          );
          this.getAttributeListByAbility(this.abilityId);
        },
        error => {
          this.toastrService.error(`${error.error.message}`, 'Error');
          this.getAttributeListByAbility(this.abilityId);
        }
      );
  }
}