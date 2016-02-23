import { routerConfig } from './index.router';
import { OccurrenceResource } from './index.resource';

export default angular.module('econdos.modules.occurrence', [])
  .config(routerConfig)
  .service('OccurrenceResource', OccurrenceResource)

