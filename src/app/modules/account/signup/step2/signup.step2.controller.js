export class AccountSignupStep2Controller {

  constructor (Session, $rootScope, $location, $window, CondoResource, CondoUserResource, CondoModals) {
    'ngInject';

    this.swal = $window.swal;
    this.location = $location;
    this.loading = false;

    this.account = Session.get();
    this.condos = CondoResource.query();
    this.CondoModals = CondoModals;
    this.CondoUserResource = CondoUserResource;
    this.CondoResource = CondoResource;
    this.rootScope = $rootScope;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'name': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  addCondoUser (condo) {
    let user = Session.get();
    this.account.
    console.log(user)
    let condoUser = new this.CondoUserResource({
      'id': {
        'condoId': condo.id,
        'userId' : this.account.userId
      }
    });

    this.rootScope.condo = condo;
    this.account.signupStep = 3;
    condoUser.$save().then(() => {
      this.location.path('/signup/3');
    });
  }

  createCondo () {
    this.CondoModals.create().then((condo) => {
      this.condos.push(condo);
      this.swal('Adicionado com Sucesso!', '', 'success');
      this.location.path('/signup/3');
    });
  }

  save () {
    this.account.signupStep = 3;
    this.location.path('/signup/3/');
  }
}
