export class CondoModals {

  constructor($uibModal) {
    'ngInject';

    this.modal = $uibModal;
  }

  create() {
    return this.modal.open({
      'templateUrl'  : 'app/modules/house/modals/create/create.view.html',
      'controller'   : 'HouseModalsCreateController',
      'controllerAs' : 'vm'
    }).result;
  }
}
