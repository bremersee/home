import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SelectOption} from '../model/select-option';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) { }

  getAvailableGroups(): Observable<Array<SelectOption>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<SelectOption>>(`${this.baseUrl}/api/admin/groups`, {
      headers: httpHeaders
    });
  }

}
