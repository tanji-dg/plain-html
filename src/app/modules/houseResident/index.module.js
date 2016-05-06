import { routerConfig } from './index.router';
import { HouseResidentResource } from './index.resource';
import { HouseResidentModals } from './modals/index.modals';
import { HouseResidentModalsCreateController } from './modals/create/create.controller';

export default angular.module('econdos.modules.houseResident', [])
  .config(routerConfig)
  .service('HouseResidentResource', HouseResidentResource)
  .service('HouseResidentModals', HouseResidentModals)
  .controller('HouseResidentModalsCreateController', HouseResidentModalsCreateController)