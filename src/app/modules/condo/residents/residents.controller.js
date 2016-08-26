export class CondoResidentsController {

  constructor ($location, $window, $stateParams,
               Session, CondoResource, CondoService, CondoModals) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.location = $location;
    this.stateParams = $stateParams;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.CondoModals = CondoModals;
    this.Session = Session;

    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.Session.setCondo(this.condo).then((user) => {
        this.user = user;
        if (this.user.defaultResidence) this.residence = this.CondoResource.getResidence({_id: this.condo._id, residenceId: this.user.defaultResidence._id, '$populate': 'users requesters'});
        this.residences = this.CondoResource.getResidences({'_id': this.condo._id, '$populate': 'users requesters'});
      });
      this.CondoResource.getUsers({'_id': this.condo._id}).$promise.then((users) => {
        this.users = users;
      });
    });
  }

  addUser() {
    this.CondoModals.addCondoUser().then((user) => {

    });
  }

  updateUser(user) {
	  this.CondoModals.updateCondoUser().then((user) => {

    });
  }

  removeUser(user) {
    this.CondoModals.deleteCondoUser(user);

	  //this.CondoModals.deleteCondoUser().then((user) => {
      //this.removeUserFromResidence(user);
    //});
  }
}
