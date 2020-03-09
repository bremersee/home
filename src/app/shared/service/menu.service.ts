import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MenuEntry} from '../model/menu-entry';

export {MenuEntry} from '../model/menu-entry';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(protected http: HttpClient) {
  }

  /**
   * Get menu entries.
   *
   * @param language The accept language.
   * @param report Flag to report request and response progress.
   */
  public getMenuEntries(language?: string, report?: boolean): Observable<Array<MenuEntry>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Accept-Language', language === null || language === undefined || language.length < 2 ? 'en' : language);
    return this.http.get<Array<MenuEntry>>(`${this.baseUrl}/api/menu`,
      {
        headers: httpHeaders,
        reportProgress: report
      }
    );
  }

}
