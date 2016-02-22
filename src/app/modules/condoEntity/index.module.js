import { routerConfig } from './index.router';
import { CondoEntityResource } from './index.resource';

export default angular.module('econdos.modules.condoUser', [])
  .config(routerConfig)
  .service('CondoEntityResource', CondoEntityResource)

