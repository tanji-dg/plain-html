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
}
