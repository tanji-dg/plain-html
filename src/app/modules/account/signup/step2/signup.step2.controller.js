export class AccountSignupStep2Controller {

  constructor(Session, $location, $window, CondoResource, CondoUserResource, CondoModals) {
    'ngInject';

    this.swal = $window.swal;
    this.location = $location;


    this.account = Session.get();
    this.condos = CondoResource.query();
    this.myCondos = CondoResource.query({'userId' : this.account.userId});
    this.myCondos.$promise.then((myCondos) => {
      this.condos = _.xorBy(this.condos, myCondos, 'id');
    });

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
      let condoIndex = _.findIndex(this.condos, { 'id': condo.id });
      this.condos.splice(condoIndex, 1);
      this.myCondos.push(condo);
      this.swal('Adicionado!', `Agora você faz parte do condomínio ${condo.name}`, 'success');
    });
  }

  removeCondoUser(condo, index) {
    let condoUser = new this.CondoUserResource({
      'condoId' : condo.id,
      'userId'  : this.account.userId
    });

    condoUser.$remove().then(() => {
      let myCondoIndex = _.findIndex(this.myCondos, { 'id': condo.id });
      this.myCondos.splice(myCondoIndex, 1);
      this.condos.push(condo);
      this.swal('Removido!', `Você não faz parte mais do condomínio ${condo.name}`, 'error');
    });
  }

  createCondo() {
      this.CondoModals.create().then((condo) => {
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
