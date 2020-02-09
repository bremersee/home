import { Component, OnInit } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAdmin = false;

  constructor(private keycloakService: KeycloakService) { }

  ngOnInit() {
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
