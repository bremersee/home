import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'https://openid.dev.bremersee.org/auth',
  realm: 'omnia',
  clientId: 'omnia'
};
export const environment = {
  production: true,
  keycloakConfig
};
