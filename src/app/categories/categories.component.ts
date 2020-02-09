import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CategorySpecification} from '../shared/model/category-specification';
import {CategoryService} from '../shared/service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Observable<Array<CategorySpecification>>;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categories = this.categoryService.getCategories();
  }

}
