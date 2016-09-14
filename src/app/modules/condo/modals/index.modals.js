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

  addCondoUser(condo, parent) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/addCondoUser/add.view.html',
      'controller'   : 'CondoModalsAddCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            condo : condo,
            parent : parent
          }
        }
      }
    }).result;
  }

  deleteCondoUser(user, residence, condo, parent) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/deleteCondoUser/delete.view.html',
      'controller'   : 'CondoModalsDeleteCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            user : user,
            residence : residence,
            condo : condo,
            parent : parent
          }
        }
      }
    }).result;
  }

  updateCondoUser(user, residence, condo, parent) {
    return this.modal.open({
      'templateUrl'  : 'app/modules/condo/modals/updateCondoUser/update.view.html',
      'controller'   : 'CondoModalsUpdateCondoUserController',
      'controllerAs' : 'vm',
      resolve : {
        DataSource : function () {
          return {
            user : user,
            residence : residence,
            condo : condo,
            parent : parent
          }
        }
      }
    }).result;
  }
}
