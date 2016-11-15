import { routerConfig } from './index.router';
import { CondoResource } from './index.resource';
import { CondoModals } from './modals/index.modals';
import { CondoService } from './services/condo.service';
import { CondoModalsCreateController } from './modals/create/create.controller';
import { CondoModalsCreateUserController } from './modals/createUser/create.controller';
import { CondoModalsAddCondoUserController } from './modals/addCondoUser/add.controller';
import { CondoModalsDeleteCondoUserController } from './modals/deleteCondoUser/delete.controller';
import { CondoModalsUpdateCondoUserController } from './modals/updateCondoUser/update.controller';
import { CondoModalsAddCondoUserProfController } from './modals/addCondoUserProf/add.controller';
import { CondoModalsDeleteCondoUserProfController } from './modals/deleteCondoUserProf/delete.controller';
import { CondoModalsUpdateCondoUserProfController } from './modals/updateCondoUserProf/update.controller';
import { CondoResidentsController } from './residents/residents.controller';
import { CreateOccurrenceController } from './modals/createOccurrence/add.controller';
import { DeleteOccurrenceController } from './modals/deleteOccurrence/delete.controller';
import { UpdateOccurrenceController } from './modals/updateOccurrence/update.controller';

export default angular.module('econdos.modules.condo', [])
  .config(routerConfig)
  .service('CondoResource', CondoResource)
  .service('CondoModals', CondoModals)
  .service('CondoService', CondoService)
  .controller('CondoModalsCreateController', CondoModalsCreateController)
  .controller('CondoModalsCreateUserController', CondoModalsCreateUserController)
  .controller('CondoModalsAddCondoUserController', CondoModalsAddCondoUserController)
  .controller('CondoModalsDeleteCondoUserController', CondoModalsDeleteCondoUserController)
  .controller('CondoModalsUpdateCondoUserController', CondoModalsUpdateCondoUserController)
  .controller('CondoModalsAddCondoUserProfController', CondoModalsAddCondoUserProfController)
  .controller('CondoModalsDeleteCondoUserProfController', CondoModalsDeleteCondoUserProfController)
  .controller('CondoModalsUpdateCondoUserProfController', CondoModalsUpdateCondoUserProfController)
  .controller('CondoResidentsController', CondoResidentsController)
  .controller('CreateOccurrenceController', CreateOccurrenceController)
  .controller('DeleteOccurrenceController', DeleteOccurrenceController)
  .controller('UpdateOccurrenceController', UpdateOccurrenceController)
  