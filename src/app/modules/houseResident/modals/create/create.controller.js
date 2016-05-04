export class HouseResidentModalsCreateController {

  constructor(Session, HouseResidentResource, $uibModalInstance) {
    'ngInject';

    this.account = Session.get();

    this.houseResident = new HouseResidentResource();
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.houseResident.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
