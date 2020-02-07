import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CategorySpecification} from '../model/category-specification';

export {CategorySpecification} from '../model/category-specification';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<Array<CategorySpecification>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<Array<CategorySpecification>>(`${this.baseUrl}/api/admin/categories`, {
      headers: httpHeaders
    });
  }

  addCategory(body: CategorySpecification): Observable<CategorySpecification> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling addCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.http.post<CategorySpecification>(`${this.baseUrl}/api/admin/categories`, body, {
      headers: httpHeaders
    });
  }

  getCategory(id: string): Observable<CategorySpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.get<CategorySpecification>(`${this.baseUrl}/api/admin/categories/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders
    });
  }

  updateCategory(id: string, body: CategorySpecification): Observable<CategorySpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling updateCategory.');
    }
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.http.put<CategorySpecification>(`${this.baseUrl}/api/admin/categories/${encodeURIComponent(String(id))}`, body, {
      headers: httpHeaders
    });
  }

  deleteCategory(id: string): Observable<void> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.http.delete<void>(`${this.baseUrl}/api/admin/categories/${encodeURIComponent(String(id))}`, {
      headers: httpHeaders
    });
  }

}
