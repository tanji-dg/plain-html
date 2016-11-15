export class CondoModals {

  constructor($uibModal) {
    'ngInject';

    this.modal = $uibModal;
  }

  create() {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/create/create.view.html',
      'controller'   : 'CondoModalsCreateController',
      'controllerAs' : 'vm'
    }).result;
  }

  createUser() {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/createUser/create.view.html',
      'controller'   : 'CondoModalsCreateUserController',
      'controllerAs' : 'vm'
    }).result;
  }

  addCondoResidence(item, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/addCondoUser/add.view.html',
      'controller'   : 'CondoModalsAddCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            item : item,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  removeResidenceFromCondo(item, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/deleteCondoUser/delete.view.html',
      'controller'   : 'CondoModalsDeleteCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            item : item,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  updateCondoResidence(item, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/updateCondoUser/update.view.html',
      'controller'   : 'CondoModalsUpdateCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            item : item,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  addCondoUserProfile(condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/addCondoUserProf/add.view.html',
      'controller'   : 'CondoModalsAddCondoUserProfController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  updateCondoUserProfile(user, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/updateCondoUserProf/update.view.html',
      'controller'   : 'CondoModalsUpdateCondoUserProfController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            user : user,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  removeUserFromCondo(user, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/deleteCondoUserProf/delete.view.html',
      'controller'   : 'CondoModalsDeleteCondoUserProfController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            user : user,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  // ==========================================================================================

  addCondoOccurrence(item, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/createOccurrence/add.view.html',
      'controller'   : 'CreateOccurrenceController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            residence : item,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  updateCondoOccurrence(occurrence, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/updateOccurrence/update.view.html',
      'controller'   : 'UpdateOccurrenceController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            occurrence : occurrence,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }

  removeOccurrenceFromCondo(occurrence, condo, refWindow) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/deleteOccurrence/delete.view.html',
      'controller'   : 'DeleteOccurrenceController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            occurrence : occurrence,
            condo : condo,
            refWindow : refWindow
          }
        }
      }
    }).result;
  }
}
