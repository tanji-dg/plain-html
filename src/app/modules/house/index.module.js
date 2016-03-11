import { routerConfig } from './index.router';
import { HouseResource } from './index.resource';
import { HouseModals } from './modals/index.modals';
import { HouseModalsCreateController } from './modals/create/create.controller';

export default angular.module('econdos.modules.house', [])
  .config(routerConfig)
  .service('HouseResource', HouseResource)
  .service('HouseModals', HouseModals)
  .controller('HouseModalsCreateController', HouseModalsCreateController)


