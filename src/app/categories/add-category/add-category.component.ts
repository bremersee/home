import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategorySpecification, Translation} from '../../shared/model/category-specification';
import {CategoryService} from '../../shared/service/category.service';
import {Router} from '@angular/router';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {LocaleDescription} from '../../shared/model/locale-description';
import {Observable} from 'rxjs';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  plusIcon = faPlusSquare;

  minusIcon = faMinusSquare;

  language: string;

  languages: Observable<Array<LocaleDescription>>;

  form: FormGroup;

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
  }

  buildForm(availableLanguages: Array<LocaleDescription>): FormGroup {
    if (this.form === null || this.form === undefined) {
      const languageCodes = new Array<string>();
      for (const language of availableLanguages) {
        languageCodes.push(language.locale);
      }
      const selectedLanguage = this.language === null || this.language === undefined || this.language.length < 2
      || languageCodes.indexOf(this.language.substr(0, 2)) < 0
        ? 'en'
        : this.language.substr(0, 2);
      this.form = this.formBuilder.group({
        order: [0, Validators.required],
        name: ['', Validators.required],
        translations: this.formBuilder.array([this.createTranslationItem(selectedLanguage)]),
        matchesGuest: [false],
        matchesUsers: this.formBuilder.array([this.createMatchesItem()]),
        matchesRoles: this.formBuilder.array([this.createMatchesItem()]),
        matchesGroups: this.formBuilder.array([this.createMatchesItem()])
      });
    }
    return this.form;
  }

  get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  matches(formArrayName: string): FormArray {
    return this.form.get(formArrayName) as FormArray;
  }

  isAddTranslationButtonDisabled(index: number): boolean {
    return (this.translations.controls[index].get('language').value as string).length === 0
      || (this.translations.controls[index].get('value').value as string).length === 0;
  }

  isAddMatchesButtonDisabled(formArrayName: string, index: number): boolean {
    return (this.matches(formArrayName).controls[index].get('value').value as string).length === 0;
  }

  addTranslation(): void {
    this.translations.controls.push(this.createTranslationItem());
  }

  addMatches(formArrayName: string): void {
    this.matches(formArrayName).controls.push(this.createMatchesItem());
  }

  removeTranslation(index: number): void {
    this.translations.controls.splice(index, 1);
  }

  removeMatches(formArrayName: string, index: number): void {
    this.matches(formArrayName).controls.splice(index, 1);
  }

  createTranslationItem(languageCode?: string): FormGroup {
    return this.formBuilder.group({
      languageSelector: [languageCode === null || languageCode === undefined ? '' : languageCode],
      language: [languageCode === null || languageCode === undefined ? '' : languageCode],
      value: ['']
    });
  }

  createMatchesItem(): FormGroup {
    return this.formBuilder.group({
      value: ['']
    });
  }

  onKeyTranslationValue(event: any, index: number): void {
    if (event.key === 'Enter' && !this.isAddTranslationButtonDisabled(index)) {
      this.addTranslation();
    }
  }

  onKeyMatchesValue(event: any, formArrayName: string, index: number): void {
    if (event.key === 'Enter' && !this.isAddMatchesButtonDisabled(formArrayName, index)) {
      this.addMatches(formArrayName);
    }
  }

  fromLanguageSelectorToLanguage(index: number): void {
    const value = this.translations.controls[index].get('languageSelector').value;
    console.error('Value = ' + value);
    this.translations.controls[index].get('language').setValue(value);
  }

  fromLanguageToLanguageSelector(index: number): void {
    const value = this.translations.controls[index].get('language').value;
    console.error('Value = ' + value);
    this.translations.controls[index].get('languageSelector').setValue(value);
  }

  addCategory(): void {
    const category: CategorySpecification = {
      order: this.form.get('order').value,
      name: this.form.get('name').value,
      translations: this.translations.controls
      .filter(value => value.get('language').value !== '' && value.get('value').value !== '')
      .map(value => {
        const translation: Translation = {
          language: value.get('language').value,
          value: value.get('value').value
        };
        return translation;
      }),
      matchesGuest: this.form.get('matchesGuest').value,
      matchesUsers: this.matches('matchesUsers').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value),
      matchesRoles: this.matches('matchesRoles').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value),
      matchesGroups: this.matches('matchesGroups').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value)
    };
    this.categoryService.addCategory(category)
    .subscribe(() => {
      this.router.navigate(['/categories'])
      .then(() => this.snackbar.show('Category successfully added.'));
    });
  }

}
