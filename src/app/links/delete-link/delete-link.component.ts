import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {CategorySpecification} from '../../shared/model/category-specification';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {CategoryService} from '../../shared/service/category.service';
import {LinkSpecification} from '../../shared/model/link-specification';
import {LinkService} from '../../shared/service/link.service';

@Component({
  selector: 'app-delete-link',
  templateUrl: './delete-link.component.html',
  styleUrls: ['./delete-link.component.css']
})
export class DeleteLinkComponent implements OnInit {

  private id: string;

  link: Observable<LinkSpecification>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackbar: SnackbarService,
              private linkService: LinkService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.link = this.linkService.getLink(this.id);
    });
  }

  cancel(): void {
    this.router.navigate(['/links']);
  }

  deleteLink(): void {
    this.linkService.deleteLink(this.id)
    .subscribe(() => {
      this.router.navigate(['/links'])
      .then(() => this.snackbar.show('Link successfully deleted.'));
    });
  }

}
