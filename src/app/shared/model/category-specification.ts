export interface CategorySpecification {

  id?: string;

  order: number;

  name: string;

  translations?: Map<string, string>;

  matchesGuest?: boolean;

  matchesUsers?: Array<string>;

  matchesRoles?: Array<string>;

  matchesGroups?: Array<string>;

}
