import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn = false;

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
  }

  get userRoles(): string[] {
    return this.keycloakService.getUserRoles(true);
  }

}
