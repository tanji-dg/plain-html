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
    this.Session = Session;

    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.Session.setCondo(this.condo).then((user) => {
        this.user = user;
        if (this.user.defaultResidence) this.residence = this.CondoResource.getResidence({_id: this.condo._id, residenceId: this.user.defaultResidence._id, '$populate': 'users requesters'});
        this.residences = this.CondoResource.getResidences({'_id': this.condo._id, '$populate': 'users requesters'});
      });
    });
  }

  setResidence () {
    if (this.newResidence && this.newResidence._id) {
      this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.newResidence._id, userId: this.user._id}).$promise.then(() => {
        this.residence = this.newResidence;
        this.newResidence = {};
        this.Session.refresh();
        this.swal("Residência selecionada", "Você foi adicionado à residência selecionada!", "success");
      });
    } else {
      return this.CondoResource.addResidence({'_id': this.condo._id}, {'identification': this.newResidence.identification}).$promise.then((residence) => {
        this.CondoResource.getResidence({
          '_id' : this.condo._id,
          'residenceId' : residence._id,
          '$populate' : 'users requesters'
        }).$promise.then((residence) => {
          this.newResidence = {};
          this.residence = residence;
            this.Session.refresh();
          this.swal("Residência cadastrada", "Você foi adicionado à residência cadastrada!", "success");
        }, () => {
          this.residenceNotFound = false;
          this.swal("Residência já existe", "Você selecionou uma residência que já existe. Escolha entre as nossas opções.", "error");
        });
      });
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
            this.swal.close();
            this.Session.refresh();
          }
        });
      }
    });
  }

  isRequester () {
    return (_.find(this.residence.requesters, {_id: this.user._id})) ? true : false;
  }
}
