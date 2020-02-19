import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {LinkService, LinkSpecification} from '../../shared/service/link.service';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import {Observable} from 'rxjs';
import {LocaleDescription} from '../../shared/model/locale-description';
import {Translation} from '../../shared/model/translation';
import {AccessControlEntry, AccessControlList} from '../../shared/model/access-control-list';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css']
})
export class AddLinkComponent implements OnInit {

  plusIcon = faPlusSquare;

  minusIcon = faMinusSquare;

  language: string;

  languages: Observable<Array<LocaleDescription>>;

  form: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private linkService: LinkService,
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
        href: ['', Validators.required],
        blank: [false],
        text: ['', Validators.required],
        textTranslations: this.formBuilder.array([this.createTranslationItem(selectedLanguage)]),
        description: ['', Validators.required],
        descriptionTranslations: this.formBuilder.array([this.createTranslationItem(selectedLanguage)]),
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

  translations(formArrayName: string): FormArray {
    return this.form.get(formArrayName) as FormArray;
  }

  aclEntries(formArrayName: string): FormArray {
    return this.form.get(formArrayName) as FormArray;
  }

  isAddTranslationButtonDisabled(formArrayName: string, index: number): boolean {
    return (this.translations(formArrayName).controls[index].get('language').value as string).length === 0
      || (this.translations(formArrayName).controls[index].get('value').value as string).length === 0;
  }

  isAddAclEntryButtonDisabled(formArrayName: string, index: number): boolean {
    return (this.aclEntries(formArrayName).controls[index].get('value').value as string).length === 0;
  }

  addTranslation(formArrayName: string): void {
    this.translations(formArrayName).controls.push(this.createTranslationItem());
  }

  addMatches(formArrayName: string): void {
    this.aclEntries(formArrayName).controls.push(this.createAclEntry());
  }

  removeTranslation(formArrayName: string, index: number): void {
    this.translations(formArrayName).controls.splice(index, 1);
  }

  removeAclEntry(formArrayName: string, index: number): void {
    this.aclEntries(formArrayName).controls.splice(index, 1);
  }

  onKeyTranslationValue(event: any, formArrayName: string, index: number): void {
    if (event.key === 'Enter' && !this.isAddTranslationButtonDisabled(formArrayName, index)) {
      this.addTranslation(formArrayName);
    }
  }

  onKeyAclEntryValue(event: any, formArrayName: string, index: number): void {
    if (event.key === 'Enter' && !this.isAddAclEntryButtonDisabled(formArrayName, index)) {
      this.addMatches(formArrayName);
    }
  }

  fromLanguageSelectorToLanguage(formArrayName: string, index: number): void {
    const value = this.translations(formArrayName).controls[index].get('languageSelector').value;
    this.translations(formArrayName).controls[index].get('language').setValue(value);
  }

  fromLanguageToLanguageSelector(formArrayName: string, index: number): void {
    const value = this.translations(formArrayName).controls[index].get('language').value;
    this.translations(formArrayName).controls[index].get('languageSelector').setValue(value);
  }

  addLink(): void {
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
    const link: LinkSpecification = {
      order: this.form.get('order').value,
      href: this.form.get('href').value,
      blank: this.form.get('blank').value,
      text: this.form.get('text').value,
      textTranslations: this.translations('textTranslations').controls
      .filter(value => value.get('language').value !== '' && value.get('value').value !== '')
      .map(value => {
        const translation: Translation = {
          language: value.get('language').value,
          value: value.get('value').value
        };
        return translation;
      }),
      description: this.form.get('text').value,
      descriptionTranslations: this.translations('descriptionTranslations').controls
      .filter(value => value.get('language').value !== '' && value.get('value').value !== '')
      .map(value => {
        const translation: Translation = {
          language: value.get('language').value,
          value: value.get('value').value
        };
        return translation;
      }),
      acl: accessControlList
    };
    this.linkService.addLink(link)
    .subscribe(() => {
      this.router.navigate(['/links'])
      .then(() => this.snackbar.show('Link successfully added.'));
    });
  }

}
