import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {CategoriesComponent} from './categories/categories.component';
import {AppAuthGuard} from './app.authguard';
import {environment} from '../environments/environment';
import {LinksComponent} from './links/links.component';
import {AddCategoryComponent} from './categories/add-category/add-category.component';

const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: 'categories/add',
    component: AddCategoryComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: 'links',
    component: LinksComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
