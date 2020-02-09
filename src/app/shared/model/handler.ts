/**
 * The handler where the exception occurred.
 */
export interface Handler {

  /**
   * The class name of the handler.
   */
  className?: string;

  /**
   * The method name of the handler.
   */
  methodName?: string;

  /**
   * The method parameters.
   */
  methodParameterTypes?: Array<string>;
}
