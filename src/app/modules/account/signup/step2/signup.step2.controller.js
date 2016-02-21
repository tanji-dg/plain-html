export class AccountSignupStep2Controller {

  constructor(Session, $location, $window, CondoResource, CondoUserResource, CondoModals) {
    'ngInject';

    this.swal = $window.swal;
    this.location = $location;


    this.account = Session.get();
    this.condos = CondoResource.query();
    this.myCondos = CondoResource.query({'userId' : this.account.userId});

    this.CondoModals = CondoModals;
    this.CondoUserResource = CondoUserResource;
  }

  addCondoUser(condo) {
    let condoUser = new this.CondoUserResource({
      'id' : {
        'condoId' : condo.id,
        'userId'  : this.account.userId
      }
    });

    condoUser.$save().then(() => {
      this.myCondos.unshift(condo);
      this.swal('Adicionado com Sucesso!', `Agora você faz parte do condomínio ${condo.name}`, 'success');
    });
  }

  removeCondoUser(condo, index) {
    let condoUser = new this.CondoUserResource({
      'condoId' : condo.id,
      'userId'  : this.account.userId
    });

    condoUser.$remove().then(() => {
      this.myCondos.splice(index, 1);
    });
  }

  createCondo() {
    this.CondoModals.create().then((condo) => {
      this.myCondos.unshift(condo);
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
