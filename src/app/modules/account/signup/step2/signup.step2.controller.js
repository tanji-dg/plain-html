export class AccountSignupStep2Controller {

  constructor ($location, $window, $q, $cookies, 
              Session, CondoResource, CondoModals) {
    'ngInject';

    this.swal = $window.swal;
    this.location = $location;
    this.loading = false;

    this.account = Session.get();
    this.condos = CondoResource.query();

    this.q = $q;
    this.Session = Session;
    this.cookies = $cookies;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'name': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  chooseCondo (condo) {
    this.cookies.putObject('condo', condo);
    this.account.signupStep = 3;
    this.account.$update().then(() => {
      this.location.path('/signup/3');
    });
  }

  createCondo () {
    return this.CondoModals.create().then((condo) => {
      this.chooseCondo(condo);
    });
  }

  save () {
    this.account.signupStep = 3;
    this.location.path('/signup/3/');
  }
}
