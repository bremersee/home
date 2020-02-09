import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

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
    await this.keycloakService.logout();
  }

  get username() {
    return this.keycloakService.getUsername();
  }

}
