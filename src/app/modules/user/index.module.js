import { routerConfig } from './index.router';
import { UserResource } from './index.resource';

export default angular.module('econdos.modules.user', [])
  .config(routerConfig)
  .service('UserResource', UserResource)

