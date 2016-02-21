export class CondoModalsCreateController {

  constructor(CondoResource, $uibModalInstance) {
    'ngInject';

    this.condo = new CondoResource();
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.condo.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
