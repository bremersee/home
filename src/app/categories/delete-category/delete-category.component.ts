import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CategorySpecification} from '../../shared/model/category-specification';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {CategoryService} from '../../shared/service/category.service';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})
export class DeleteCategoryComponent implements OnInit {

  private id: string;

  category: Observable<CategorySpecification>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackbar: SnackbarService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.category = this.categoryService.getCategory(this.id);
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }

  deleteCategory(): void {
    this.categoryService.deleteCategory(this.id)
    .subscribe(() => {
      this.router.navigate(['/categories'])
      .then(() => this.snackbar.show('Category successfully deleted.'));
    });
  }

}
