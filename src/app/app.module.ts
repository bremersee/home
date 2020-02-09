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
    AddLinkComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgbModule
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
  async ngDoBootstrap(app) {
    try {
      await keycloakService.init({
        config: window.location.origin + environment.keycloakConfigLocation,
        initOptions: {
          flow: 'standard',
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256'
        }
      });
      app.bootstrap(AppComponent);
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }
}
