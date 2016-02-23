import { routerConfig } from './index.router';
import { CondoAdminResource } from './index.resource';

export default angular.module('econdos.modules.condoAdmin', [])
  .config(routerConfig)
  .service('CondoAdminResource', CondoAdminResource)

