export class AccountSignupStep2Controller {

  constructor ($location, $window, $q,
              Session, CondoResource, CondoModals, CondoService) {
    'ngInject';

    this.q = $q;
    this.swal = $window.swal;
    this.location = $location;
    this.Session = Session;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.CondoService = CondoService;

    this.user = Session.get();
    this.condos = CondoResource.query();

    this.loading = false;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'$text[$search]': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  chooseCondo (condo) {
    this.user.signupStep = 3;
    _.clone(this.user).$update().then(() => {
      this.CondoService.set(condo);
      this.location.path('/signup/3');
    });
  }

  createCondo () {
    return this.CondoModals.create().then((condo) => {
      this.chooseCondo(condo);
    });
  }

  save () {
    this.user.signupStep = 3;
    this.location.path('/signup/3/');
  }
}
