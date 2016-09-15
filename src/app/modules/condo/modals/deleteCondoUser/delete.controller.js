export class CondoModalsDeleteCondoUserController {

  constructor($window, $uibModalInstance,
              CondoResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.CondoResource = CondoResource;
    this.Session = Session;
    this.modalInstance = $uibModalInstance;

    this.user = DataSource.user;
    this.residence = DataSource.residence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo);

    this.isUserResident = false;
    if (this.loggedUser._id === this.user._id)
    {
      for (let res of this.user.residences.userResidences.entries()) {
        if (res[1]._id === this.residence._id) {
          this.isUserResident = true;
          break;
        }
      }
    }
  }

  removeFromResidence() {
    if (this.isUserResident || this.isCondoAdmin || this.isCondoOwner) {
      this.swal({
        title: "Tem certeza que deseja excluir o usuário " + this.user.firstName + " da residência " + this.residence.identification + "?",
        text: "Esta ação não poderá ser desfeita.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: true
      }, (isConfirm) => {
        if (isConfirm) {
          if (this.user._id === this.residence.voter) {
            this.CondoResource.setVoterUserToResidence({'condoId': this.condo._id, 'residenceId' : this.residence._id, 'userId' : ''}).$promise.then(() => {});
          }

          this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
            this.swal("Integrante Removido", "O integrante foi removido da residência com sucesso!", "success");
            this.close();
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  removeFromCondo() {
    if (this.isCondoAdmin || this.isCondoOwner) {
      this.swal({
        title: "Tem certeza que deseja excluir o usuário " + this.user.firstName + " do condomínio " + this.condo.name + "?",
        text: "Esta ação não poderá ser desfeita.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: true
      }, (isConfirm) => {
        if (isConfirm) {
          this.CondoResource.removeUserFromCondo({'condoId': this.condo._id, 'userId': this.user._id}).$promise.then(() => {
            this.swal("Integrante Removido", "O integrante foi removido do condomínio com sucesso!", "success");
            this.close();
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  close() {
    this.modalInstance.dismiss();
  }
}
