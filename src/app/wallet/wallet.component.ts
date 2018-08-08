import { Component, OnInit } from '@angular/core';
import {WalletService} from '../config/config.service';
import {ActivatedRoute} from '@angular/router';

class Transaction {
  constructor(
    public txn_uid: string = '',
    public txn_type: string = 'credit',
    public amount: string = '',
    public closing_balance: string = '',
    public c_uid: string = '',

  ) {}
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  transactions = [];
  errorMessage = '';
  c_cuid = null;
  w_object = {'w_type' : 'NA', 'current_balance' : 'NA'};

  // It maintains registration Model
  txnModel: Transaction;
  // It maintains registration form display status. By default it will be false.
  showNew: Boolean = false;
  // It will be either 'Save' or 'Update' based on operation.
  submitType = 'Save';
  // It maintains table row index based on selection.
  selectedRow: number;
  txn_types: string[] = ['debit', 'credit'];

  constructor(private walletService: WalletService, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.c_cuid = params['c_uid'];
      console.log(this.c_cuid);
      console.log(params);
    });

  }
//Create ngOnInit() and and load articles
  ngOnInit(): void {
    this.getAllTransactions(this.c_cuid);
  }
  //Fetch all transactions
  getAllTransactions(c_uid) {
    this.walletService.getTransaction(c_uid)
      .subscribe(result_data => {
        if (result_data['success'] === 0) {
          alert(result_data['message']);
          return false;
        }
        result_data = result_data['data'];
        this.transactions = result_data['txn_objects'];
        if (this.transactions === undefined) {
          this.transactions = [];
        }
        this.w_object = result_data['w_object'];
      }, error => this.errorMessage = <any>error);
  }

  // This method associate to Save Button.
  onSave() {
    if (this.submitType === 'Save') {
      this.txnModel['c_uid'] = this.c_cuid;
      this.walletService.addTransaction(this.txnModel)
        .subscribe(result_data => {
          if (result_data['success'] === 0) {
            alert(result_data['message']);
            return false;
          }
          result_data = result_data['data'];
          this.transactions.push(result_data['txn_obj']);
          this.w_object = result_data['w_object'];
        }, error => this.errorMessage = <any>error);
    }
    // Hide registration entry section.
    this.showNew = false;
  }

  // This method associate to Delete Button.
  onDelete(index: number, txn_uid : string) {
    // Delete the corresponding registration entry from the list.
    this.walletService.cancelTransaction(txn_uid)
      .subscribe(result_data => {
        if (result_data['success'] === 0) {
          alert(result_data['message']);
          return false;
        }
        result_data = result_data['data'];
        this.transactions[index] = result_data['txn_obj'];
        this.w_object = result_data['w_object'];
      }, error => this.errorMessage = <any>error);
    // this.transactions.splice(index, 1);
  }

  // This method associate to New Button.
  onNew() {
    // Initiate new registration.
    this.txnModel = new Transaction();
    // Change submitType to 'Save'.
    this.submitType = 'Save';
    // display registration entry section.
    this.showNew = true;
  }

  // This method associate toCancel Button.
  onCancel() {
    // Hide registration entry section.
    this.showNew = false;
  }

  // This method associate to Bootstrap dropdown selection change.
  onChangeWalletType(txn_type: string) {
    // Assign corresponding selected country to model.
    this.txnModel.txn_type = txn_type;
  }

}
