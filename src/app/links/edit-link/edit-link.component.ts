import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AccessControlList, LinkSpecification, Translation} from '../../shared/model/link-specification';
import {LinkService} from '../../shared/service/link.service';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import {LocaleDescription} from '../../shared/model/locale-description';
import {SelectOption} from '../../shared/model/select-option';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {RoleService} from '../../shared/service/role.service';
import {GroupService} from '../../shared/service/group.service';
import {AccessControlEntry} from '../../shared/model/access-control-entry';

@Component({
  selector: 'app-edit-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.css']
})
export class EditLinkComponent implements OnInit {

  private id: string;

  plusIcon = faPlusSquare;

  minusIcon = faMinusSquare;

  language: string;

  link: Observable<LinkSpecification>;

  languages: Observable<Array<LocaleDescription>>;

  roles: Observable<Array<SelectOption>>;

  groups: Observable<Array<SelectOption>>;

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private linkService: LinkService,
              private languageService: LanguageService,
              private roleService: RoleService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.link = this.linkService.getLink(this.id);
    });
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);
    this.roles = this.roleService.getAvailableRoles();
    this.groups = this.groupService.getAvailableGroups();
  }

  buildForm(link: LinkSpecification, availableLanguages: Array<LocaleDescription>): FormGroup {
    if (this.form === null || this.form === undefined) {
      const languageCodes = availableLanguages.map(language => language.locale);
      const selectedLanguage = this.language === null || this.language === undefined || this.language.length < 2
      || languageCodes.indexOf(this.language.substr(0, 2)) < 0
        ? 'en'
        : this.language.substr(0, 2);
      const aclEntry: AccessControlEntry = this.findAclEntry(link);
      this.form = this.formBuilder.group({
        order: [link.order, Validators.required],
        href: [link.href, Validators.required],
        blank: [link.blank],
        text: [link.text, Validators.required],
        textTranslations: this.formBuilder.array(this.createTranslationItems(link.textTranslations, selectedLanguage)),
        description: [link.description, Validators.required],
        descriptionTranslations: this.formBuilder.array(this.createTranslationItems(link.descriptionTranslations, selectedLanguage)),
        guest: [aclEntry.guest],
        users: this.formBuilder.array(this.createAclEntries(aclEntry.users)),
        roles: this.formBuilder.array(this.createAclEntries(aclEntry.roles)),
        groups: this.formBuilder.array(this.createAclEntries(aclEntry.groups))
      });
    }
    return this.form;
  }

  findAclEntry(link: LinkSpecification): AccessControlEntry {
    const defaultEntry: AccessControlEntry = {
      permission: 'read',
      guest: false,
      users: [],
      roles: [],
      groups: []
    };
    if (link.acl !== undefined && link.acl !== null && link.acl.entries !== undefined && link.acl.entries !== null) {
      return link.acl.entries.find(e => e.permission === 'read', defaultEntry);
    }
    return defaultEntry;
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

  createAclEntries(values: Array<string>): Array<FormGroup> {
    if (values !== undefined && values !== null && values.length > 0) {
      return values.map(value => this.createAclEntry(value));
    } else {
      const formGroups = new Array<FormGroup>();
      formGroups.push(this.createAclEntry());
      return formGroups;
    }
  }

  createAclEntry(value?: string): FormGroup {
    return this.formBuilder.group({
      value: [value === null || value === undefined ? '' : value]
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

  addAclEntry(formArrayName: string): void {
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
      this.addAclEntry(formArrayName);
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

  updateLink(): void {
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
      description: this.form.get('description').value,
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
    this.linkService.updateLink(this.id, link)
    .subscribe(() => {
      this.router.navigate(['/links'])
      .then(() => this.snackbar.show('Link successfully added.'));
    });
  }

}
