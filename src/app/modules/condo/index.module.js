import { routerConfig } from './index.router';
import { CondoResource } from './index.resource';
import { CondoModals } from './modals/index.modals';
import { CondoModalsCreateController } from './modals/create/create.controller';

export default angular.module('econdos.modules.condo', [])
  .config(routerConfig)
  .service('CondoResource', CondoResource)
  .service('CondoModals', CondoModals)
  .controller('CondoModalsCreateController', CondoModalsCreateController)

