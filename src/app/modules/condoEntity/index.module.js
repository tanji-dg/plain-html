import { routerConfig } from './index.router';
import { CondoEntityResource } from './index.resource';

export default angular.module('econdos.modules.condoEntity', [])
  .config(routerConfig)
  .service('CondoEntityResource', CondoEntityResource)

