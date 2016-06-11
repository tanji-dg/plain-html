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

    this.setUpCondo();
  }

  setUpCondo () {
    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.CondoService.set(this.condo);
      this.CondoResource.getResidences({'_id': this.condo._id, '$populate': 'users requesters'}).$promise.then((residences) => {
        if(residences.length === 0) {
          this.CondoResource.addResidence({'_id': this.condo._id}, {'identification': 0}).$promise.then((residence) => {
            this.residence = this.CondoResource.getResidence({
              '_id' : this.condo._id,
              'residenceId' : residence._id,
              '$populate' : 'users requesters'
            });
          });
        } else {
          this.residence = residences[0];
        }
      });
    });
  }

  addUser () {
    this.CondoModals.createUser().then((user) => {
      this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
        if(!this._.some(this.residence.residents, {'_id': user._id})) this.residence.residents.push(user)
      })
    });
  }

  removeUser (user) {
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
          this.swal("Integrante Removido", "O integrante foi removido com sucesso!", "success");
          let userIndex = this._.findIndex(this.residence.residents, {'_id': user._id});
          this.residence.residents.splice(userIndex, 1);
        });
      }
    });
  }

  save () {
    return this.CondoResource.updateResidence({'_id': this.condo._id, 'residenceId' : this.residence._id}, {'identification': this.residence.identification}).$promise.then(() => {
      this.swal("Família Atualizada!", "Sua família foi atualizada com sucesso.", "success");
    })
  }
}
