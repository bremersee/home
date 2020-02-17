import {Translation} from './translation';

export {Translation} from './translation';

export interface CategorySpecification {

  id?: string;

  order: number;

  name: string;

  translations?: Array<Translation>;

  matchesGuest?: boolean;

  matchesUsers?: Array<string>;

  matchesRoles?: Array<string>;

  matchesGroups?: Array<string>;

}
