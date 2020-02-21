import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LinkSpecification} from '../shared/model/link-specification';
import {LinkService} from '../shared/service/link.service';
import {faEdit, faTrashAlt} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  editIcon = faEdit;

  deleteIcon = faTrashAlt;

  links: Observable<Array<LinkSpecification>>;

  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
    this.links = this.linkService.getLinks();
  }

}
