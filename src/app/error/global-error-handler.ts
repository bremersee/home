import {ErrorHandler, Injectable, Injector, Type} from '@angular/core';
import {RestApiException} from '../shared/model/rest-api-exception';
import {SnackbarService} from '../shared/snackbar/snackbar.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error) {
    console.error('An error occurred: {}', error);
    let errorMessage = error.message;
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.error !== undefined && error.error !== null) {
      const restApiException = error.error as RestApiException;
      if (restApiException.message) {
        errorMessage = restApiException.message;
      }
    }
    const snackbar = this.injector.get<SnackbarService>(SnackbarService as Type<SnackbarService>);
    snackbar.show(errorMessage, 'danger');
  }

}
