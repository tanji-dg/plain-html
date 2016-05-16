import { routerConfig } from './index.router';
import { ResidenceResource } from './index.resource';
import { ResidenceModals } from './modals/index.modals';
import { ResidenceModalsCreateController } from './modals/create/create.controller';

export default angular.module('econdos.modules.residence', [])
  .config(routerConfig)
  .service('ResidenceResource', ResidenceResource)
  .service('ResidenceModals', ResidenceModals)
  .controller('ResidenceModalsCreateController', ResidenceModalsCreateController)


