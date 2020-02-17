import {AccessControlList} from './access-control-list';
import {Translation} from './translation';

export {AccessControlList} from './access-control-list';
export {Translation} from './translation';

export interface LinkSpecification {

  id?: string;

  acl: AccessControlList;

  order: number;

  href: string;

  blank?: boolean;

  text: string;

  textTranslations?: Array<Translation>;

  description?: string;

  descriptionTranslations?: Array<Translation>;

}
