import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {WalletService} from '../config/config.service';

class Registration {
  constructor(
    public uid: string = '',
    public username: string = '',
    public password: string = '',
    public w_type: string = 'regular',
  ) {}
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  // It maintains list of Registrations
  registrations= [];
  // It maintains registration Model
  regModel: Registration;
  // It maintains registration form display status. By default it will be false.
  showNew: Boolean = false;
  // It will be either 'Save' or 'Update' based on operation.
  submitType: string = 'Save';
  // It maintains table row index based on selection.
  selectedRow: number;
  // It maintains Array of countries.
  wallet_types: string[] = ['regular', 'overdraft'];
  new_registrations = [];
  errorMessage = ''

  param1: string;
  constructor( private walletService: WalletService) {
    // Add default registration data.
  }

  ngOnInit() {
    this.getAllRegistrations();
  }

  getAllRegistrations() {
    this.walletService.getRegistrations()
      .subscribe(result_data => {
        this.registrations = result_data['data'];
        this.new_registrations = this.registrations;
      }, error => this.errorMessage = <any>error);
  }

  // This method associate to New Button.
  onNew() {
    // Initiate new registration.
    this.regModel = new Registration();
    // Change submitType to 'Save'.
    this.submitType = 'Save';
    // display registration entry section.
    this.showNew = true;
  }

  // This method associate to Save Button.
  onSave() {
    if (this.submitType === 'Save') {
      this.walletService.add_customer(this.regModel)
        .subscribe(result_data => {
          this.registrations.push(result_data['data']);
          this.new_registrations = this.registrations;
        }, error => this.errorMessage = <any>error);
    }
    // Hide registration entry section.
    this.showNew = false;
  }
  // This method associate to Delete Button.
  onDelete(index: number) {
    // Delete the corresponding registration entry from the list.
    this.registrations.splice(index, 1);
  }
  // This method associate toCancel Button.
  onCancel() {
    // Hide registration entry section.
    this.showNew = false;
  }

  // This method associate to Bootstrap dropdown selection change.
  onChangeWalletType(wallet_type: string) {
    // Assign corresponding selected country to model.
    this.regModel.w_type = wallet_type;
  }

}
