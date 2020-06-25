import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {LinkSpecification} from '../../shared/model/link-specification';
import {Translation} from '../../shared/model/translation';
import {LinkService} from '../../shared/service/link.service';
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-regular-svg-icons';
import {LocaleDescription} from '../../shared/model/locale-description';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../shared/snackbar/snackbar.service';
import {LanguageService} from '../../shared/service/language.service';
import {CategorySpecification} from '../../shared/model/category-specification';
import {CategoryService} from '../../shared/service/category.service';

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

  categories: Observable<Array<CategorySpecification>>;

  form: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private linkService: LinkService,
              private languageService: LanguageService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id') || '';
      this.link = this.linkService.getLink(this.id);
    });
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);
    this.categories = this.categoryService.getCategories();
  }

  buildForm(link: LinkSpecification,
            availableLanguages: Array<LocaleDescription>,
            availableCategories: Array<CategorySpecification>): FormGroup {

    if (this.form === null || this.form === undefined) {
      const languageCodes = availableLanguages.map(language => language.locale);
      const selectedLanguage = this.language === null || this.language === undefined || this.language.length < 2
      || languageCodes.indexOf(this.language.substr(0, 2)) < 0
        ? 'en'
        : this.language.substr(0, 2);
      this.form = this.formBuilder.group({
        order: [link.order, Validators.required],
        href: [link.href, Validators.required],
        blank: [link.blank],
        text: [link.text, Validators.required],
        textTranslations: this.formBuilder.array(this.createTranslationItems(link.textTranslations, selectedLanguage)),
        description: [link.description],
        descriptionTranslations: this.formBuilder.array(this.createTranslationItems(link.descriptionTranslations, selectedLanguage)),
        categories: this.formBuilder.array(this.createSelectedCategories(availableCategories, link.categoryIds))
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

  createSelectedCategories(availableCategories: Array<CategorySpecification>, values: Array<string>): Array<FormGroup> {
    return availableCategories.map(category => this.formBuilder.group({
      id: [category.id],
      name: [category.name],
      selected: [values.indexOf(category.id) >= 0]
    }));
  }

  translations(formArrayName: string): FormArray {
    return this.form.get(formArrayName) as FormArray;
  }

  isAddTranslationButtonDisabled(formArrayName: string, index: number): boolean {
    return (this.translations(formArrayName).controls[index].get('language').value as string).length === 0
      || (this.translations(formArrayName).controls[index].get('value').value as string).length === 0;
  }

  addTranslation(formArrayName: string): void {
    this.translations(formArrayName).controls.push(this.createTranslationItem());
  }

  removeTranslation(formArrayName: string, index: number): void {
    this.translations(formArrayName).controls.splice(index, 1);
  }

  onKeyTranslationValue(event: any, formArrayName: string, index: number): void {
    if (event.key === 'Enter' && !this.isAddTranslationButtonDisabled(formArrayName, index)) {
      this.addTranslation(formArrayName);
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
      categoryIds: (this.form.get('categories') as FormArray).controls
      .filter(value => value.get('selected').value === true)
      .map(value => value.get('id').value)
    };
    this.linkService.updateLink(this.id, link)
    .subscribe(() => {
      this.router.navigate(['/links'])
      .then(() => this.snackbar.show('Link successfully updated.'));
    });
  }

}
