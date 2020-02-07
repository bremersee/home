import {AccessControlList} from './access-control-list';

export {AccessControlList} from './access-control-list';

export interface LinkSpecification {

  id?: string;

  acl: AccessControlList;

  order: number;

  href: string;

  blank?: boolean;

  text: string;

  textTranslations?: Map<string, string>;

  description?: string;

  descriptionTranslations?: Map<string, string>;

}
