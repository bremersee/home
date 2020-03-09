/**
 * A link description.
 */
export interface Link {

  /**
   * The ID.
   */
  readonly id?: string;

  /**
   * The URI.
   */
  href: string;

  /**
   * The type.
   */
  type?: string;

  /**
   * Specified whether to open the link in a blank target (default is false).
   */
  blank?: boolean;

  /**
   * The link text.
   */
  text?: string;

  /**
   * A short description.
   */
  description?: string;

}
