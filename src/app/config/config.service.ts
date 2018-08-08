import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class WalletService {
  constructor(private http: HttpClient) {
  }

  url_base = 'http://127.0.0.1:8000/api/';

  add_customer(data_model): Observable<any> {
    return this.http.post(this.url_base + 'get_wallet?format=json', data_model);
  }
  getRegistrations(): Observable<any> {
    return this.http.get(this.url_base + 'get_registrations?format=json');
  }
  addTransaction(txn_model): Observable<any> {
    return this.http.post(this.url_base + 'create_transaction?format=json', txn_model);
  }
  getTransaction(c_uid): Observable<any> {
    return this.http.get(this.url_base + 'get_all_transaction?c_uid=' + c_uid + '&format=json');
  }
  cancelTransaction(txn_uid): Observable<any> {
    return this.http.get(this.url_base + 'cancel_transaction?txn_uid=' + txn_uid + '&format=json');
  }
  private extractData(res: Response) {
    const body = res.json();
    return body;
  }
  private handleError (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.status);
  }

}






