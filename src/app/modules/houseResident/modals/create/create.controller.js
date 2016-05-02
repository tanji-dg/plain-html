export class HouseResidentModalsCreateController {

  constructor(Session, HouseResidentResource, $uibModalInstance) {
    'ngInject';

    this.account = Session.get();

    this.houseResident = new HouseResidentResource();
    this.houseResidents = HouseResidentResource.query({'userId' : this.account.userId});
    console.log(this.houseResidents);
    this.modalInstance = $uibModalInstance;
  }

  save() {
    this.houseResident.$save().then((response) => {
      this.modalInstance.close(response);
    });
  }
}
