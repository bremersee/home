import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Observable} from 'rxjs';
import {MenuEntry, MenuService} from '../shared/service/menu.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn = false;

  language: string;

  menuEntries: Observable<Array<MenuEntry>>;

  constructor(private keycloakService: KeycloakService, private menuService: MenuService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.keycloakService.isLoggedIn().then(r => this.isLoggedIn = r);
    this.menuEntries = this.menuService.getMenuEntries(this.language);
  }

}
