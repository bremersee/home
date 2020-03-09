import {Link} from './link';

export {Link} from './link';

/**
 * The category and it's links.
 */
export interface MenuEntry {

  /**
   * The name of the category.
   */
  category: string;

  /**
   * Specifies whether the links of this category can be seen without authentication. Default is false.
   */
  pub: boolean;

  /**
   * The links of the category.
   */
  links?: Array<Link>;

}
