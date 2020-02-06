import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private keycloakService: KeycloakService) {
  }

  isLoggedIn = false;

  ngOnInit() {
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
  }

  async login() {
    await this.keycloakService.login();
    /*
    const option: Keycloak.KeycloakLoginOptions = {
      redirectUri: 'http://localhost:4200'
    };
    this.keycloakService.login(option).then(() => {
      this.ngOnInit();
    });
    */
  }

  /*
  async isLoggedIn() {
    return await this.keycloakService.isLoggedIn();
  }
  */

  async logout() {
    await this.keycloakService.logout();
  }

  get username() {
    return this.keycloakService.getUsername();
  }

}
