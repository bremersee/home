import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CategorySpecification} from '../model/category-specification';

export {CategorySpecification} from '../model/category-specification';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.linkmanBaseUrl;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Add a category.
   *
   * @param body The new category.
   * @param report flag to report request and response progress.
   */
  public addCategory(body: CategorySpecification, report?: boolean): Observable<CategorySpecification> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling addCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.httpClient.post<CategorySpecification>(`${this.baseUrl}/api/categories`, body, {
      headers: httpHeaders,
      reportProgress: report
    });
  }

  /**
   * Delete a category.
   *
   * @param id The category ID.
   * @param report flag to report request and response progress.
   */
  public deleteCategory(id: string, report?: boolean): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.httpClient.request<any>('delete', `${this.baseUrl}/api/categories/${encodeURIComponent(String(id))}`,
      {
        headers: httpHeaders,
        reportProgress: report
      }
    );
  }

  /**
   * Get all categories.
   *
   * @param report flag to report request and response progress.
   */
  public getCategories(report?: boolean): Observable<Array<CategorySpecification>> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.httpClient.request<Array<CategorySpecification>>('get', `${this.baseUrl}/api/categories`,
      {
        headers: httpHeaders,
        reportProgress: report
      }
    );
  }

  /**
   * Get a category.
   *
   * @param id The category ID.
   * @param report flag to report request and response progress.
   */
  public getCategory(id: string, report?: boolean): Observable<CategorySpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.httpClient.request<CategorySpecification>('get', `${this.baseUrl}/api/categories/${encodeURIComponent(String(id))}`,
      {
        headers: httpHeaders,
        reportProgress: report
      }
    );
  }

  /**
   * Checks whether a public category exists.
   *
   * @param report flag to report request and response progress.
   */
  public publicCategoryExists(report?: boolean): Observable<boolean> {
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
    return this.httpClient.request<boolean>('get', `${this.baseUrl}/api/categories/f/public-exists`,
      {
        headers: httpHeaders,
        reportProgress: report
      }
    );
  }

  /**
   * Update a category.
   *
   * @param id The category ID.
   * @param body The new category specification.
   * @param report Flag to report request and response progress.
   */
  public updateCategory(id: string, body: CategorySpecification, report?: boolean): Observable<CategorySpecification> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling updateCategory.');
    }
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateCategory.');
    }
    const httpHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
    return this.httpClient.put<CategorySpecification>(`${this.baseUrl}/api/categories/${encodeURIComponent(String(id))}`, body, {
      headers: httpHeaders,
      reportProgress: report
    });
  }

}
