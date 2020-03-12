import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, ErrorHandler, NgModule} from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {HeaderComponent} from './header/header.component';
import {AuthComponent} from './header/auth/auth.component';
import {environment} from '../environments/environment';
import { CategoriesComponent } from './categories/categories.component';
import { LinksComponent } from './links/links.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import {GlobalErrorHandler} from './error/global-error-handler';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { AddLinkComponent } from './links/add-link/add-link.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import { EditCategoryComponent } from './categories/edit-category/edit-category.component';
import { EditLinkComponent } from './links/edit-link/edit-link.component';
import { DeleteCategoryComponent } from './categories/delete-category/delete-category.component';
import { DeleteLinkComponent } from './links/delete-link/delete-link.component';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    AuthComponent,
    CategoriesComponent,
    LinksComponent,
    SnackbarComponent,
    AddCategoryComponent,
    AddLinkComponent,
    EditCategoryComponent,
    EditLinkComponent,
    DeleteCategoryComponent,
    DeleteLinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor() {
    library.add(fas, far);
  }

  async ngDoBootstrap(app) {
    try {
      await keycloakService.init({
        config: window.location.origin + environment.keycloakConfigLocation,
        initOptions: {
          flow: 'standard',
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + environment.silentCheckSsoLocation,
          pkceMethod: 'S256'
        }
      });
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}
