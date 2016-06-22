export class FeedResidentsController {

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

    this.user = Session.get();
    this.isResidenceSet = false;

    this.setUpCondo();
  }

  setUpCondo () {
    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.CondoService.set(this.condo);

      this.residences = [{_id: 0, identification: 'Carregando...'}];
      this.residence = this.residences[0];

      this.CondoResource.getResidences({'_id': this.condo._id, '$populate': 'users requesters'}).$promise.then((residences) => {
        this.residence = {};
        this.residences = residences;
      });
    });
  }

  setResidence () {
    let from = (this.residenceNotFound) ? 'input' : 'select';

    if (this.residence.identification) {
      if (from === 'select') {
        return this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: this.user._id}).$promise.then(() => {
          this.isResidenceSet = true;
          this.swal("Residência selecionada", "Você foi adicionado à residência selecionada!", "success");
        });
      } else {
        return this.CondoResource.addResidence({'_id': this.condo._id}, {'identification': this.residence.identification}).$promise.then((residence) => {
          this.CondoResource.getResidence({
            '_id' : this.condo._id,
            'residenceId' : residence._id,
            '$populate' : 'users requesters'
          }).$promise.then((residence) => {
            this.residence = residence;
            this.isResidenceSet = true;
            this.swal("Residência cadastrada", "Você foi adicionado à residência cadastrada!", "success");
          });
        });
      }
    } else {
      swal('Ops!', ((from === 'select') ? 'Selecione o identificador da sua residência' : 'Digite o identificador da sua residência'), 'error');
      return false;
    }
  }

  addUser () {
    this.CondoModals.createUser().then((user) => {
      this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
        if(!this._.some(this.residence.requesters, {'_id': user._id})) this.residence.requesters.push(user);
      })
    });
  }

  removeUser (user, users) {
    this.swal({
      title: "Tem certeza?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
          if(user != this.user) {
            this.swal("Integrante Removido", "O integrante foi removido com sucesso!", "success");
            let userIndex = this._.findIndex(users, {'_id': user._id});
            users.splice(userIndex, 1);
          } else {
            this.residence = {};
            this.isResidenceSet = false;
            this.swal.close();
          }
        });
      }
    });
  }
}
