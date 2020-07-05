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
import {CategorySpecification} from '../../shared/model/category-specification';
import {CategoryService} from '../../shared/service/category.service';
import {Dimensions, ImageCroppedEvent} from 'ngx-image-cropper';
import {DomSanitizer} from '@angular/platform-browser';

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

  categories: Observable<Array<CategorySpecification>>;

  form: FormGroup;

  imageFormData: FormData;

  cardImageUrl: any;

  cardImageFile: any = null;

  cardImageWidth = 1;

  cardImageHeight = 1;

  maintainCardImageAspectRatio = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private snackbar: SnackbarService,
              private linkService: LinkService,
              private languageService: LanguageService,
              private categoryService: CategoryService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    // @ts-ignore
    this.language = navigator.language || navigator.userLanguage;
    this.languages = this.languageService.getAvailableLanguages(this.language);
    this.categories = this.categoryService.getCategories();
    this.imageFormData = new FormData();
  }

  buildForm(availableLanguages: Array<LocaleDescription>, availableCategories: Array<CategorySpecification>): FormGroup {
    if (this.form === null || this.form === undefined) {
      const languageCodes = availableLanguages.map(language => language.locale);
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
        displayText: [true],
        description: [''],
        descriptionTranslations: this.formBuilder.array([this.createTranslationItem(selectedLanguage)]),
        categories: this.formBuilder.array(this.createSelectedCategories(availableCategories))
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

  createSelectedCategories(availableCategories: Array<CategorySpecification>): Array<FormGroup> {
    return availableCategories.map(category => this.formBuilder.group({
      id: [category.id],
      name: [category.name],
      selected: [false]
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

  onCardImageChange(event): void {
    this.imageFormData.delete('cardImage');
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cardImageFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.cardImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
        this.imageFormData.append('cardImage', this.cardImageUrl);
      };
    } else {
      this.cardImageUrl = undefined;
      this.cardImageFile = null;
    }
  }

  cardImageCropperReady(dimensions: Dimensions): void {
    this.cardImageHeight = dimensions.height;
    this.cardImageWidth = dimensions.width;
  }

  cardImageCropped(event: ImageCroppedEvent): void {
    this.imageFormData.delete('cardImage');
    this.cardImageUrl = event.base64;

    const img: Blob = this.convertDataUri(this.cardImageUrl);
    if (img.size < 262144) {
      this.imageFormData.append('cardImage', this.cardImageUrl);
    } else {
      this.imageFormData.append('cardImage', img, this.cardImageFile.name);
    }
  }

  convertDataUri(dataUri): Blob {
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  addLink(): void {
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
      displayText: this.form.get('displayText').value,
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
    this.linkService.addLink(link)
    .subscribe((linkSpec) => {
      if (this.imageFormData.get('cardImage') !== undefined && this.imageFormData.get('cardImage') !== null) {
        this.linkService.updateLinkImages(linkSpec.id, this.imageFormData)
        .subscribe(() => {
          this.router.navigate(['/links'])
          .then(() => this.snackbar.show('Link successfully added.'));
        });
      } else {
        this.router.navigate(['/links'])
        .then(() => this.snackbar.show('Link successfully added.'));
      }
    });
  }

}
