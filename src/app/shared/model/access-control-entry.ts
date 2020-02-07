export interface AccessControlEntry {

  permission: string;

  guest?: boolean;

  users?: Array<string>;

  roles?: Array<string>;

  groups?: Array<string>;

}
