export class HouseModalsCreateController {

  constructor(HouseResource, $uibModalInstance) {
    'ngInject';

    this.house = new HouseResource();
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.house.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
