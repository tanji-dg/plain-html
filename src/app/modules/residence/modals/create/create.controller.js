export class ResidenceModalsCreateController {

  constructor(ResidenceResource, $uibModalInstance) {
    'ngInject';

    this.residence = new ResidenceResource();
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.residence.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
