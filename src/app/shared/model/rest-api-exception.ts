import {Handler} from './handler';
import {StackTraceItem} from './stack-trace-item';

export {Handler} from './handler';
export {StackTraceItem} from './stack-trace-item';

/**
 * The serialized exception.
 */
export interface RestApiException {

  /**
   * The name of the application.
   */
  application?: string;

  cause?: RestApiException;

  /**
   * The class name of the exception.
   */
  className?: string;

  /**
   * A service specific error code.
   */
  errorCode?: string;

  /**
   * Is the error code inherited from the cause?
   */
  errorCodeInherited?: boolean;

  handler?: Handler;

  /**
   * The id of the exception.
   */
  id?: string;

  /**
   * A human readable exception message.
   */
  message?: string;

  /**
   * The request path.
   */
  path?: string;

  /**
   * The stack trace.
   */
  stackTrace?: Array<StackTraceItem>;

  /**
   * The timestamp.
   */
  timestamp?: Date;

}
