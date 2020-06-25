import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomHttpUrlEncodingCodec} from '../encoder';
import {LinkSpecification} from '../model/link-specification';

export {LinkSpecification} from '../model/link-specification';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) {
  }

  getLinks(categoryId?: string, report?: boolean): Observable<Array<LinkSpecification>> {
    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (categoryId !== undefined && categoryId !== null) {
      queryParameters = queryParameters.set('categoryId', categoryId);
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<LinkSpecification>>(`${this.baseUrl}/api/links`, {
      headers: httpHeaders,
      params: queryParameters,
      reportProgress: report
    });
  }

  addLink(body: LinkSpecification, report?: boolean): Observable<LinkSpecification> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling addLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.http.post<LinkSpecification>(`${this.baseUrl}/api/links`, body, {
      headers: httpHeaders,
      reportProgress: report
    });
  }

  getLink(id: string, report?: boolean): Observable<LinkSpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<LinkSpecification>(`${this.baseUrl}/api/links/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders,
      reportProgress: report
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
    return this.http.put<LinkSpecification>(`${this.baseUrl}/api/links/${encodeURIComponent(String(id))}`, body, {
      headers: httpHeaders
    });
  }

  updateLinkImages(id: string, formData: FormData): Observable<LinkSpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling saveLinkImages.');
    }
    if (formData === null || formData === undefined) {
      throw new Error('Required parameter body was null or undefined when calling saveLinkImages.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.post<LinkSpecification>(`${this.baseUrl}/api/links/${encodeURIComponent(String(id))}/images`, formData, {
      headers: httpHeaders
    });
  }

  deleteLinkImages(id: string, ...linkImageTypes: string[]): Observable<LinkSpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteLink.');
    }
    let names: string[];
    if (linkImageTypes === null || linkImageTypes === undefined || linkImageTypes.length === 0) {
      names = new Array<string>();
      names.push('cardImage');
    } else {
      names = linkImageTypes;
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.delete<LinkSpecification>(`${this.baseUrl}/api/links/${encodeURIComponent(String(id))}/images`, {
      headers: httpHeaders,
      params: {
        name: names
      }
    });
  }

  deleteLink(id: string): Observable<void> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteLink.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.delete<void>(`${this.baseUrl}/api/links/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders
    });
  }

}
