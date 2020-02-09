/**
 * A stack trace element of an exception.
 */
export interface StackTraceItem {

  /**
   * The declaring class.
   */
  declaringClass?: string;

  /**
   * The file name.
   */
  fileName?: string;

  /**
   * The line number.
   */
  lineNumber?: number;

  /**
   * The method name.
   */
  methodName?: string;
}
