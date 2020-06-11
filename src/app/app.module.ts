import {BrowserModule} from '@angular/platform-browser';
import {DoBootstrap, ErrorHandler, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {CookieService} from 'ngx-cookie-service';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {GlobalErrorHandler} from './error/global-error-handler';
import {SnackbarComponent} from './shared/snackbar/snackbar.component';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AuthComponent} from './header/auth/auth.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {CategoriesComponent} from './categories/categories.component';
import {LinksComponent} from './links/links.component';
import {AddCategoryComponent} from './categories/add-category/add-category.component';
import {AddLinkComponent} from './links/add-link/add-link.component';
import {EditCategoryComponent} from './categories/edit-category/edit-category.component';
import {EditLinkComponent} from './links/edit-link/edit-link.component';
import {DeleteCategoryComponent} from './categories/delete-category/delete-category.component';
import {DeleteLinkComponent} from './links/delete-link/delete-link.component';
import {AppAuthGuard} from './app.authguard';
import {ImageCropperModule} from 'ngx-image-cropper';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    SnackbarComponent,
    WelcomeComponent,
    CategoriesComponent,
    LinksComponent,
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
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgbModule,
    FontAwesomeModule,
    ImageCropperModule
  ],
  providers: [
    CookieService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    AppAuthGuard
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
