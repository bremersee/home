import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoggedIn = false;

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
  }

  async login() {
    await this.keycloakService.login();
  }

  async logout() {
    await this.keycloakService.logout(window.location.origin + environment.keycloakLogoutLocation);
  }

  get username() {
    return this.keycloakService.getUsername();
  }

}
