import { routerConfig } from './index.router';
import { CondoResource } from './index.resource';

export default angular.module('econdos.modules.condo', [])
  .config(routerConfig)
  .service('CondoResource', CondoResource)

