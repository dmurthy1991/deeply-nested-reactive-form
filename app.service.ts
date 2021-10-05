import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AppService {

  addressList1 = ['Address1', 'Address2', 'Address3', 'Address4', 'Address5', 'Address6'];

  addressList2 = ['Address7', 'Address8', 'Address9', 'Address10', 'Address11', 'Address12'];


  constructor(
    private http: HttpClient) {
  }

  getAddress(name: string): Observable<string[]> {
    const creditRatings = new Observable<string[]>(observer => {
      if (name === 'Company 1') {
        setTimeout(() => {
          observer.next(this.addressList1);
        }, 1000);
      }
      else if (name === 'Company 2') {
        setTimeout(() => {
          observer.next(this.addressList2);
        }, 1000);
      }

    });
    return creditRatings;
  }

}