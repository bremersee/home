import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccessControlList, CategorySpecification, Translation} from '../../shared/model/category-specification';
import {CategoryService} from '../../shared/service/category.service';
import {Router} from '@angular/router';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {LocaleDescription} from '../../shared/model/locale-description';
import {Observable} from 'rxjs';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import {RoleService} from '../../shared/service/role.service';
import {GroupService} from '../../shared/service/group.service';
import {SelectOption} from '../../shared/model/select-option';
import {AccessControlEntry} from '../../shared/model/access-control-entry';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  plusIcon = faPlusSquare;

  minusIcon = faMinusSquare;

  language: string;

  publicCategoryExists: Observable<boolean>;

  languages: Observable<Array<LocaleDescription>>;

  roles: Observable<Array<SelectOption>>;

  groups: Observable<Array<SelectOption>>;

  form: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private categoryService: CategoryService,
              private languageService: LanguageService,
              private roleService: RoleService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.publicCategoryExists = this.categoryService.publicCategoryExists();
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);
    this.roles = this.roleService.getAvailableRoles();
    this.groups = this.groupService.getAvailableGroups();
  }

  buildForm(availableLanguages: Array<LocaleDescription>): FormGroup {
    if (this.form === null || this.form === undefined) {
      const languageCodes = availableLanguages.map(language => language.locale);
      const selectedLanguage = this.language === null || this.language === undefined || this.language.length < 2
      || languageCodes.indexOf(this.language.substr(0, 2)) < 0
        ? 'en'
        : this.language.substr(0, 2);
      this.form = this.formBuilder.group({
        order: [0, Validators.required],
        name: ['', Validators.required],
        translations: this.formBuilder.array([this.createTranslationItem(selectedLanguage)]),
        guest: [false],
        users: this.formBuilder.array([this.createAclEntry()]),
        roles: this.formBuilder.array([this.createAclEntry()]),
        groups: this.formBuilder.array([this.createAclEntry()])
      });
    }
    return this.form;
  }

  createTranslationItem(languageCode?: string): FormGroup {
    return this.formBuilder.group({
      languageSelector: [languageCode === null || languageCode === undefined ? '' : languageCode],
      language: [languageCode === null || languageCode === undefined ? '' : languageCode],
      value: ['']
    });
  }

  createAclEntry(): FormGroup {
    return this.formBuilder.group({
      value: ['']
    });
  }

  get translations(): FormArray {
    return this.form.get('translations') as FormArray;
  }

  aclEntries(formArrayName: string): FormArray {
    return this.form.get(formArrayName) as FormArray;
  }

  isAddTranslationButtonDisabled(index: number): boolean {
    return (this.translations.controls[index].get('language').value as string).length === 0
      || (this.translations.controls[index].get('value').value as string).length === 0;
  }

  isAddAclEntryButtonDisabled(formArrayName: string, index: number): boolean {
    return (this.aclEntries(formArrayName).controls[index].get('value').value as string).length === 0;
  }

  addTranslation(): void {
    this.translations.controls.push(this.createTranslationItem());
  }

  addAclEntry(formArrayName: string): void {
    this.aclEntries(formArrayName).controls.push(this.createAclEntry());
  }

  removeTranslation(index: number): void {
    this.translations.controls.splice(index, 1);
  }

  removeAclEntry(formArrayName: string, index: number): void {
    this.aclEntries(formArrayName).controls.splice(index, 1);
  }

  onKeyTranslationValue(event: any, index: number): void {
    if (event.key === 'Enter' && !this.isAddTranslationButtonDisabled(index)) {
      this.addTranslation();
    }
  }

  onKeyAclEntryValue(event: any, formArrayName: string, index: number): void {
    if (event.key === 'Enter' && !this.isAddAclEntryButtonDisabled(formArrayName, index)) {
      this.addAclEntry(formArrayName);
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

  addCategory(): void {
    const isPublic = this.form.get('guest').value as boolean;
    const accessControlEntry: AccessControlEntry = {
      permission: 'read',
      guest: isPublic,
      users: isPublic ? [] : this.aclEntries('users').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value),
      roles: isPublic ? [] : this.aclEntries('roles').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value),
      groups: isPublic ? [] : this.aclEntries('groups').controls
      .filter(value => value.get('value').value !== '')
      .map(value => value.get('value').value)
    };
    const accessControlList: AccessControlList = {
      entries: [accessControlEntry]
    };
    const category: CategorySpecification = {
      acl: accessControlList,
      order: this.form.get('order').value,
      name: this.form.get('name').value,
      translations: this.translations.controls
      .filter(value => value.get('language').value !== '' && value.get('value').value !== '')
      .map(value => {
        return {
          language: value.get('language').value,
          value: value.get('value').value
        };
      })
    };
    this.categoryService.addCategory(category)
    .subscribe(() => {
      this.router.navigate(['/categories'])
      .then(() => this.snackbar.show('Category successfully added.'));
    });
  }

}
