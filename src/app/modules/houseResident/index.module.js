import { routerConfig } from './index.router';
import { HouseResidentResource } from './index.resource';

export default angular.module('econdos.modules.houseResident', [])
  .config(routerConfig)
  .service('HouseResidentResource', HouseResidentResource)

