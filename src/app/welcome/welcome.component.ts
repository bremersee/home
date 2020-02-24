import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {LinkContainer, LinkService} from '../shared/service/link.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn = false;

  language: string;

  linkContainers: Observable<Array<LinkContainer>>;

  constructor(private keycloakService: KeycloakService, private linkService: LinkService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
    this.linkContainers = this.linkService.getLinkContainers(this.language);
  }

}
