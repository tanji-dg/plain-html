import { routerConfig } from './index.router';
import { AuthorityResource } from './index.resource';

export default angular.module('econdos.modules.authority', [])
  .config(routerConfig)
  .service('AuthorityResource', AuthorityResource)

