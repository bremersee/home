import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService, CategorySpecification} from '../../shared/service/category.service';
import {Observable} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {RoleService} from '../../shared/service/role.service';
import {GroupService} from '../../shared/service/group.service';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import {LocaleDescription} from '../../shared/model/locale-description';
import {SelectOption} from '../../shared/model/select-option';
import {Translation} from '../../shared/model/translation';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  private id: string;

  plusIcon = faPlusSquare;

  minusIcon = faMinusSquare;

  language: string;

  category: Observable<CategorySpecification>;

  publicCategoryExists: Observable<boolean>;

  languages: Observable<Array<LocaleDescription>>;

  roles: Observable<Array<SelectOption>>;

  groups: Observable<Array<SelectOption>>;

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private categoryService: CategoryService,
              private languageService: LanguageService,
              private roleService: RoleService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.category = this.categoryService.getCategory(this.id);
    });
    this.publicCategoryExists = this.categoryService.publicCategoryExists();
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);
    this.roles = this.roleService.getAvailableRoles();
    this.groups = this.groupService.getAvailableGroups();
  }

  buildForm(category: CategorySpecification, availableLanguages: Array<LocaleDescription>): FormGroup {
    if (this.form === null || this.form === undefined) {
      const languageCodes = availableLanguages.map(language => language.locale);
      const selectedLanguage = this.language === null || this.language === undefined || this.language.length < 2
      || languageCodes.indexOf(this.language.substr(0, 2)) < 0
        ? 'en'
        : this.language.substr(0, 2);

      this.form = this.formBuilder.group({
        order: [category.order, Validators.required],
        name: [category.name, Validators.required],
        translations: this.formBuilder.array(this.createTranslationItems(category.translations, selectedLanguage)),
        matchesGuest: [category.matchesGuest],
        matchesUsers: this.formBuilder.array(this.createMatchesItems(category.matchesUsers)),
        matchesRoles: this.formBuilder.array(this.createMatchesItems(category.matchesRoles)),
        matchesGroups: this.formBuilder.array(this.createMatchesItems(category.matchesGroups))
      });
    }
    return this.form;
  }

  createTranslationItems(translations: Array<Translation>, selectedLanguage: string): Array<FormGroup> {
    if (translations !== undefined && translations !== null && translations.length > 0) {
      return translations.map(translation => this.createTranslationItem(translation.language, translation.value));
    } else {
      const formGroups = new Array<FormGroup>();
      formGroups.push(this.createTranslationItem(selectedLanguage));
      return formGroups;
    }
  }

  createTranslationItem(languageCode?: string, value?: string): FormGroup {
    return this.formBuilder.group({
      languageSelector: [languageCode === null || languageCode === undefined ? '' : languageCode],
      language: [languageCode === null || languageCode === undefined ? '' : languageCode],
      value: [value === null || value === undefined ? '' : value]
    });
  }

  createMatchesItems(values: Array<string>): Array<FormGroup> {
    if (values !== undefined && values !== null && values.length > 0) {
      return values.map(value => this.createMatchesItem(value));
    } else {
      const formGroups = new Array<FormGroup>();
      formGroups.push(this.createMatchesItem());
      return formGroups;
    }
  }

  createMatchesItem(value?: string): FormGroup {
    return this.formBuilder.group({
      value: [value === null || value === undefined ? '' : value]
    });
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
    this.translations.controls[index].get('language').setValue(value);
  }

  fromLanguageToLanguageSelector(index: number): void {
    const value = this.translations.controls[index].get('language').value;
    this.translations.controls[index].get('languageSelector').setValue(value);
  }

  updateCategory(): void {
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
    this.categoryService.updateCategory(this.id, category)
    .subscribe(() => {
      this.router.navigate(['/categories'])
      .then(() => this.snackbar.show('Category successfully updated.'));
    });
  }

}
