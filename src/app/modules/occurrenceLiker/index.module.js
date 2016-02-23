import { routerConfig } from './index.router';
import { OccurrenceLikerResource } from './index.resource';

export default angular.module('econdos.modules.occurrenceLiker', [])
  .config(routerConfig)
  .service('OccurrenceLikerResource', OccurrenceLikerResource)

