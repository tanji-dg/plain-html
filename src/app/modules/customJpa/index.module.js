import { routerConfig } from './index.router';
import { CustomJpaResource } from './index.resource';

export default angular.module('econdos.modules.customJpa', [])
  .config(routerConfig)
  .service('CustomJpaResource', CustomJpaResource)

