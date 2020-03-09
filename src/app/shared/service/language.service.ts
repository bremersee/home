import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocaleDescription} from '../model/locale-description';

export {LocaleDescription} from '../model/locale-description';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) {
  }

  getAvailableLanguages(language?: string, report?: boolean): Observable<Array<LocaleDescription>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Accept-Language', language === null || language === undefined || language.length < 2 ? 'en' : language);
    return this.http.get<Array<LocaleDescription>>(`${this.baseUrl}/api/languages`, {
      headers: httpHeaders,
      reportProgress: report
    });
  }

}
