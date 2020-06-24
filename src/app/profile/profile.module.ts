import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AddEditEmploymentContractComponent } from './add-edit-employment-contract/add-edit-employment-contract.component';
import { ViewEmploymentContractComponent } from './view-employment-contract/view-employment-contract.component';
import { DisapproveConfirmationComponent } from '@app/shared/dialog-box/disapprove-confirmation/disapprove-confirmation.component';
@NgModule({
  declarations: [
    ProfileComponent,
    ViewProfileComponent,
    EditProfileComponent,
    AddEditEmploymentContractComponent,
    ViewEmploymentContractComponent,
    DisapproveConfirmationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ProfileRoutingModule
  ],
  entryComponents: [DisapproveConfirmationComponent]
})
export class ProfileModule {}
