export class CondoModalsUpdateCondoUserController {

  constructor($window, $uibModalInstance,
              CondoResource, UserResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.CondoResource = CondoResource;
    this.UserResource = UserResource;
    this.Session = Session;
    this.modalInstance = $uibModalInstance;

    this.user = DataSource.item.user;
    this.residence = DataSource.item.residence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;
    this.profile = DataSource.item.profile;
    this.currentResidenceProfile = this.profile;

    this.userName = this.user.firstName + " " + this.user.lastName;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo._id);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);

    this.residenceProfiles = [
      "Proprietário(direito à voto)",
      "Residente",
      "Requisitante"
    ];
  }

  update() {
    if (this.user !== 'none') {
      this.updateUserResidenceProfile();
    }
  }

  updateUserResidenceProfile() {
    if (this.currentResidenceProfile === this.profile) {
      this.swal("Dados Inválidos", "Não houve modificações!", "warning");
      return;
    }

    if (this.isCondoAdmin || this.isCondoOwner) {
      this.swal({
        title: "Tem certeza que deseja continuar com a atualização?",
        text: "Esta ação não poderá ser desfeita.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: true
      }, (isConfirm) => {
        if (isConfirm) {
          if (this.currentResidenceProfile === 'Proprietário(direito à voto)') {
            this.CondoResource.clearResidenceVoter({'_id': this.condo._id, 'residenceId' : this.residence._id, 'voter' : null}).$promise.then(() => {});
          }

          this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
            if (this.profile === "Proprietário(direito à voto)") {
              this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                this.swal("Atualização Concluída", "A atualização foi realizada com sucesso!", "success");
                this.refWindow.loadAllCollections();
                this.close();
              });
            } else {
              this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                if (this.profile === "Residente") {
                  this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                    this.swal("Atualização Concluída", "A atualização foi realizada com sucesso!", "success");
                    this.refWindow.loadAllCollections();
                    this.close();
                  });
                }
              }).then(() => {
                this.swal("Atualização Concluída", "A atualização foi realizada com sucesso!", "success");
                this.refWindow.loadAllCollections();
                this.close();
              });
            }
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  close () {
    this.modalInstance.dismiss();
  }
}
