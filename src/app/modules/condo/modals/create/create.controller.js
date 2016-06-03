export class CondoModalsCreateController {

  constructor(CondoResource, $uibModalInstance) {
    'ngInject';

    this.condo = new CondoResource();
    this.modalInstance = $uibModalInstance;
    this.CondoResource = CondoResource;
  }

  save() {
    return this.condo.$save().then((c) => {
      this.CondoResource.get({'_id': c._id}).$promise.then((condo) => {
        this.modalInstance.close(condo);
      });
    });
  }

  close () {
    this.modalInstance.dismiss();
  }
}
