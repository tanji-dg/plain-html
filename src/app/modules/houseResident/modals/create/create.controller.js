export class HouseResidentModalsCreateController {

  constructor(HouseResidentResource, $uibModalInstance) {
    'ngInject';

    this.houseResident = new HouseResidentResource();
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.houseResident.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
