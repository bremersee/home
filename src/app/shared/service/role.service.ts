import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {SelectOption} from '../model/select-option';

export {SelectOption} from '../model/select-option';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) {
  }

  getAvailableRoles(): Observable<Array<SelectOption>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<SelectOption>>(`${this.baseUrl}/api/roles`, {
      headers: httpHeaders
    });
  }

}
