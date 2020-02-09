import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LinkSpecification} from '../shared/model/link-specification';
import {LinkService} from '../shared/service/link.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  links: Observable<Array<LinkSpecification>>;

  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
    this.links = this.linkService.getLinks();
  }

}
