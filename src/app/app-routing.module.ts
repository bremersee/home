import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {CategoriesComponent} from './categories/categories.component';
import {AppAuthGuard} from './app.authguard';
import {environment} from '../environments/environment';
import {LinksComponent} from './links/links.component';
import {AddCategoryComponent} from './categories/add-category/add-category.component';
import {AddLinkComponent} from './links/add-link/add-link.component';
import {EditCategoryComponent} from './categories/edit-category/edit-category.component';
import {EditLinkComponent} from './links/edit-link/edit-link.component';
import {DeleteLinkComponent} from './links/delete-link/delete-link.component';
import {DeleteCategoryComponent} from './categories/delete-category/delete-category.component';

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
    path: 'categories/:id/edit',
    component: EditCategoryComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: 'categories/:id/delete',
    component: DeleteCategoryComponent,
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
    path: 'links/add',
    component: AddLinkComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: 'links/:id/edit',
    component: EditLinkComponent,
    canActivate: [AppAuthGuard],
    data: {
      roles: environment.adminRoles
    }
  },
  {
    path: 'links/:id/delete',
    component: DeleteLinkComponent,
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
