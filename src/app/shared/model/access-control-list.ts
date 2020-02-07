import {AccessControlEntry} from './access-control-entry';

export {AccessControlEntry} from './access-control-entry';

export interface AccessControlList {

  owner?: string;

  entries?: Array<AccessControlEntry>;

}
