import { routerConfig } from './index.router';
import { HouseResource } from './index.resource';

export default angular.module('econdos.modules.house', [])
  .config(routerConfig)
  .service('HouseResource', HouseResource)

