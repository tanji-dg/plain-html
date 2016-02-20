import { routerConfig } from './index.router';
import { CondoUserResource } from './index.resource';

export default angular.module('econdos.modules.condoUser', [])
  .config(routerConfig)
  .service('CondoUserResource', CondoUserResource)

