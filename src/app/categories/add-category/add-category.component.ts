import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategorySpecification} from '../../shared/model/category-specification';
import {CategoryService} from '../../shared/service/category.service';
import {Router} from '@angular/router';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {Observable} from 'rxjs';
import {LocaleDescription} from '../../shared/model/locale-description';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  language: string;

  languages: Observable<Array<LocaleDescription>>;

  form: FormGroup;

  translationItems: {
    language: string;
    value: string;
  }[];

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private categoryService: CategoryService,
              private languageService: LanguageService) {
  }

  ngOnInit() {
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);


    this.translationItems = [];
    this.form = this.formBuilder.group({
      order: [0, Validators.required],
      name: ['', Validators.required],
      translations: this.formBuilder.array([this.createTranslationItem(this.language)]),
      matchesGuest: [false]
    });
  }

  createTranslationItem(languageCode?: string): FormGroup {
    return this.formBuilder.group({
      translation: [languageCode === null || languageCode === undefined ? '' : languageCode],
      value: ['']
    });
  }

  get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  addCategory(): void {
    const category: CategorySpecification = {
      order: this.form.get('order').value,
      name: this.form.get('name').value
    };
    this.categoryService.addCategory(category)
    .subscribe(response => {
      this.router.navigate(['/categories'])
      .then(() => this.snackbar.show('Category successfully added.'));
    });
  }

}
