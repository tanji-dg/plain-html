export class CondoModalsUpdateCondoUserProfController {

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

    this.user = DataSource.user;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.currentCondoProfile = this.user.condoProfile;

    this.userName = this.user.firstName + " " + this.user.lastName;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo._id);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);

    this.condoProfiles = [
      "Síndico",
      "Admin",
      "Morador",
      "Requisitante da Residência"
    ];

    if (!this.isCondoOwner) {
      this.condoProfiles.splice(0, 1);
    }

    if (!this.isCondoAdmin && !this.isCondoOwner) {
      this.condoProfiles.splice(1, 1);
    }
  }

  updateUserFromCondo() {
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
          if (this.currentCondoProfile !== this.user.condoProfile) {
            this.CondoResource.removeUserFromCondoAdm({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {
              this.CondoResource.removeUserFromCondo({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {
                this.CondoResource.addUserToCondo({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {
                  if (this.user.condoProfile === "Morador") {
                    this.CondoResource.setApproveUserToCondo({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {});
                  }

                  if ((this.isCondoOwner || this.isCondoAdmin) && this.user.condoProfile === "Admin") {
                    this.CondoResource.addUserToCondoAdmins({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {});
                  }

                  if (this.isCondoOwner && this.user.condoProfile === "Síndico") {
                    this.CondoResource.addUserToCondoOwners({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
                  }

                  this.swal("Dados Atualizados", "A atualização foi realizada com sucesso!", "success");
                  this.refWindow.loadAllCollections();
                  this.close();
                });
              });
            });
          }
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
      this.close();
    }
  }

  close () {
    this.modalInstance.dismiss();
  }
}
