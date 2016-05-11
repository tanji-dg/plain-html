import { routerConfig } from './index.router';
import { CondoResource } from './index.resource';
import { CondoModals } from './modals/index.modals';
import { CondoService } from './services/condo.service';
import { CondoModalsCreateController } from './modals/create/create.controller';
import { CondoModalsCreateUserController } from './modals/createUser/create.controller';

export default angular.module('econdos.modules.condo', [])
  .config(routerConfig)
  .service('CondoResource', CondoResource)
  .service('CondoModals', CondoModals)
  .service('CondoService', CondoService)
  .controller('CondoModalsCreateController', CondoModalsCreateController)
  .controller('CondoModalsCreateUserController', CondoModalsCreateUserController)

