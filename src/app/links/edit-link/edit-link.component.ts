import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {LinkSpecification} from '../../shared/model/link-specification';
import {LinkService} from '../../shared/service/link.service';

@Component({
  selector: 'app-edit-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.css']
})
export class EditLinkComponent implements OnInit {

  private id: string;

  link: Observable<LinkSpecification>;

  constructor(private route: ActivatedRoute, private linkService: LinkService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.link = this.linkService.getLink(this.id);
    });
  }

}
