export class CondoModalsCreateController {

  constructor($window, $uibModalInstance, CondoResource) {
    'ngInject';

    this.window = $window;
    this.condo = new CondoResource();
    this.modalInstance = $uibModalInstance;
    this.CondoResource = CondoResource;
    this.CondoResource = CondoResource;
  }

  save() {
    let condo = angular.copy(this.condo);
    return this.condo.$save().then(c => {
      condo._id = c._id
      this.modalInstance.close(condo);
    }, (response) => {
      this.window.swal("Ops!", "Este condomínio já existe!", "error");
      this.modalInstance.dismiss();
    });
  }

  close () {
    this.modalInstance.dismiss();
  }
}
