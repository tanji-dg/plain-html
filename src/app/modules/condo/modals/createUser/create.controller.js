export class CondoModalsCreateUserController {

  constructor(CondoResource, CondoService, UserResource, $uibModalInstance) {
    'ngInject';

    this.user = new UserResource();
    this.UserResource = UserResource;
    this.CondoResource = CondoResource;
    this.modalInstance = $uibModalInstance;

    this.condo = CondoService.get();
  }

  filterUsers () {
    this.users = this.UserResource.query({'email': this.filterTerm});
  }

  chooseUser (user) {
    return this.CondoResource.addUser({'_id': this.condo._id, 'userId': user._id}, {email: this.filterTerm}).$promise.then(() => {
      this.modalInstance.close(user);
    });
  }

  createUser() {
    return this.CondoResource.createUser({'_id': this.condo._id}, {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.filterTerm
    }).$promise.then((user) => {
      user.firstName = this.user.firstName;
      user.lastName = this.user.lastName;
      user.email = this.filterTerm;
      this.modalInstance.close(user);
    });
  }

  close () {
    this.modalInstance.dismiss();
  }
}
