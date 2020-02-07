import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LinkContainer} from '../model/link-container';
import {LinkSpecification} from '../model/link-specification';

export {LinkContainer} from '../model/link-container';
export {LinkSpecification} from '../model/link-specification';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) {
  }

  getLinkContainers(): Observable<Array<LinkContainer>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<LinkContainer>>(`${this.baseUrl}/api/public/links`, {
      headers: httpHeaders
    });
  }

  getLinks(): Observable<Array<LinkSpecification>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<LinkSpecification>>(`${this.baseUrl}/api/admin/links`, {
      headers: httpHeaders
    });
  }

  addLink(body: LinkSpecification): Observable<LinkSpecification> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling addLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.http.post<LinkSpecification>(`${this.baseUrl}/api/admin/links`, body, {
      headers: httpHeaders
    });
  }

  getLink(id: string): Observable<LinkSpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<LinkSpecification>(`${this.baseUrl}/api/admin/links/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders
    });
  }

  updateLink(id: string, body: LinkSpecification): Observable<LinkSpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling updateLink.');
    }
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.http.put<LinkSpecification>(`${this.baseUrl}/api/admin/links/${encodeURIComponent(String(id))}`, body, {
      headers: httpHeaders
    });
  }

  deleteLink(id: string): Observable<void> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.delete<void>(`${this.baseUrl}/api/admin/links/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders
    });
  }

}
