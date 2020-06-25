import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Observable} from 'rxjs';
import {MenuEntry, MenuService} from '../shared/service/menu.service';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  editIcon = faEdit;

  isLoggedIn = false;

  isAdmin = false;

  language: string;

  menuEntries: Observable<Array<MenuEntry>>;

  constructor(private keycloakService: KeycloakService, private menuService: MenuService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
    this.menuEntries = this.menuService.getMenuEntries(this.language);

    this.isAdmin = false;
    const roles = this.keycloakService.getUserRoles(true);
    if (roles && roles.length > 0) {
      for (const requiredRole of environment.adminRoles) {
        if (roles.indexOf(requiredRole) > -1) {
          this.isAdmin = true;
          break;
        }
      }
    }
  }

}
