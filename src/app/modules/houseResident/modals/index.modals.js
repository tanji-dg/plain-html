export class HouseResidentModals {

  constructor($uibModal) {
    'ngInject';

    this.modal = $uibModal;
  }

  create() {
    return this.modal.open({
      'templateUrl'  : 'app/modules/houseResident/modals/create/create.view.html',
      'controller'   : 'HouseResidentModalsCreateController',
      'controllerAs' : 'vm'
    }).result;
  }
}
