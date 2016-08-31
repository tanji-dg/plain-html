export class CondoModalsUpdateCondoUserController {

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

    this.userName = this.user.firstName + " " + this.user.lastName;

    this.loggedUser = this.Session.get();

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

    this.isCondoAdmin = false;
    let index =
      this.loggedUser.condosOwner.concat(this.loggedUser.condosAdmin)
        .findIndex((x) => x = this.condo._id);
    if (index != -1) {
      this.isCondoAdmin = true;
    }

    this.condoProfiles = [
      "Super Admin",
      "Admin",
      "Morador",
      "Requisitante da Residência"
    ];
  }

  updateData() {
    if (this.isUserResident || this.isCondoAdmin) {
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
          //this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
          //  this.swal("Dados Atualizados", "A atualização foi realizada com sucesso!", "success");
          //});
        }
      });

      this.close();
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  close () {
    this.modalInstance.dismiss();
  }
}
