export class CondoModals {

  constructor($uibModal) {
    'ngInject';

    this.modal = $uibModal;
  }

  create() {
    return this.modal.open({
      'templateUrl'  : 'app/modules/residence/modals/create/create.view.html',
      'controller'   : 'ResidenceModalsCreateController',
      'controllerAs' : 'vm'
    }).result;
  }
}
