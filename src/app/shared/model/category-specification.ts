import {AccessControlList} from './access-control-list';
import {Translation} from './translation';

export {AccessControlList} from './access-control-list';
export {Translation} from './translation';

/**
 * The specification of a category.
 */
export interface CategorySpecification {

  /**
   * Unique identifier of the category.
   */
  readonly id?: string;

  acl: AccessControlList;

  /**
   * The sort order value.
   */
  order: number;

  /**
   * The default name.
   */
  name: string;

  /**
   * The translations of the name.
   */
  translations?: Array<Translation>;

}
