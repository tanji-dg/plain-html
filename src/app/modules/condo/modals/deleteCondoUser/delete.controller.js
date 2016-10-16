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

    this.user = DataSource.item.user;
    this.residence = DataSource.item.residence;
    this.profile = DataSource.item.profile;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo._id);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);
  }

  remove() {
    if (this.user === 'none') {
      this.removeResidence();
    } else {
      this.removeUserResidence();
    }
  }

  removeResidence() {
    if (this.isCondoAdmin || this.isCondoOwner) {
      this.swal({
        title: "Tem certeza que deseja excluir a residência " + this.residence.identification + "?",
        text: "Esta ação não poderá ser desfeita.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: true
      }, (isConfirm) => {
        if (isConfirm) {
          this.CondoResource.removeResidenceFromCondo({'_id': this.condo._id, 'residenceId': this.residence._id}).$promise.then(() => {
            this.swal("Residência Removida", "A residência foi removida do condomínio com sucesso!", "success");
            this.refWindow.loadAllCollections();
            this.close();
          }).catch((error) => {
            this.swal("Erro", error.data, "warning");
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  removeUserResidence() {
    if (this.isCondoAdmin || this.isCondoOwner) {
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
          if (this.profile === 'Proprietário(direito à voto)')
          {
            this.CondoResource.clearResidenceVoter({'_id': this.condo._id, 'residenceId' : this.residence._id, 'voter' : null}).$promise.then(() => {});
            this.swal("Integrante Removido", "O integrante foi removido da residência com sucesso!", "success");
            this.refWindow.loadAllCollections();
            this.close();
          } else {
            this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
              this.swal("Integrante Removido", "O integrante foi removido da residência com sucesso!", "success");
              this.refWindow.loadAllCollections();
              this.close();
            });
          }
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
