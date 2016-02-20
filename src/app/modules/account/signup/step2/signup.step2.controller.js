export class AccountSignupStep2Controller {

  constructor(Session, $location, $window, CondoResource, CondoUserResource) {
    'ngInject';

    this.swal = $window.swal;
    this.location = $location;

    this.account = Session.get();
    this.condos = CondoResource.query();

    this.CondoUserResource = CondoUserResource;

    this.account.$promise.then(() => {
      this.myCondos = CondoResource.query({'userId' : this.account.userId});
    });
  }

  addCondoUser(condo) {
    let condoUser = new this.CondoUserResource({
      'id' : {
        'condoId' : condo.id,
        'userId'  : this.account.userId
      }
    });

    condoUser.$save().then(() => {
      this.myCondos.push(condo);
      this.swal('Adicionado com Sucesso!', `Agora você faz parte do condomínio ${condo.name}`, 'success');
    });
  }

  save() {
    this.account.signupStep = 3;
    this.account.$save().then(() => {
      this.location.path('/signup/3');
    });
  }
}
