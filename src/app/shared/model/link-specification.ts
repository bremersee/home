import {Translation} from './translation';

export {Translation} from './translation';

/**
 * The specification of a link.
 */
export interface LinkSpecification {

  /**
   * Unique identifier of the link.
   */
  readonly id?: string;

  /**
   * The category IDs.
   */
  categoryIds?: Array<string>;

  /**
   * The sort order.
   */
  order: number;

  /**
   * The linked resource.
   */
  href: string;

  /**
   * Specified whether to open the link in a blank target (default is false).
   */
  blank?: boolean;

  /**
   * The text that is displayed instead of the link.
   */
  text: string;

  /**
   * The translations of the text.
   */
  textTranslations?: Array<Translation>;

  /**
   * The description of the link.
   */
  description?: string;

  /**
   * The translations of the description.
   */
  descriptionTranslations?: Array<Translation>;

}
