import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CategoryService, CategorySpecification} from '../../shared/service/category.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  private id: string;

  category: Observable<CategorySpecification>;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.category = this.categoryService.getCategory(this.id);
    });
  }

}
