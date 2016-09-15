export class CondoModalsAddCondoUserController {

  constructor($window, $uibModalInstance,
              CondoResource, UserResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.Session = Session;
    this.UserResource = UserResource;
    this.CondoResource = CondoResource;
    this.modalInstance = $uibModalInstance;

    this.condo = DataSource.condo;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo);

    this.condoProfiles = [
      "Super Admin",
      "Admin",
      "Morador",
      "Requisitante da Residência"
    ];

    this.residenceProfiles = [
      "Requisitante",
      "Residente",
      "Proprietário(direito à voto)"
    ];

    if (!this.isCondoOwner) {
      this.condoProfiles.splice(0, 1);
    }

    if (!this.isCondoAdmin && !this.isCondoOwner) {
      this.condoProfiles.splice(1, 1);
    }
  }

  addUserToCondo() {
    if (this.isCondoAdmin || this.isCondoOwner) {
      this.swal({
        title: "Tem certeza que deseja continuar com a inclusão?",
        text: "Esta ação não poderá ser desfeita.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Não",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        closeOnConfirm: true
      }, (isConfirm) => {
        if (isConfirm) {
          this.CondoResource.addUserToCondo({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {
            if (this.user.condoProfile === "Morador") {
              this.CondoResource.setApproveUserToCondo({'condoId': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }

            if ((this.isCondoOwner || this.isCondoAdmin) && this.user.condoProfile === "Admin") {
              this.CondoResource.addUserToCondoAdmins({'condoId': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }

            if (this.isCondoOwner && this.user.condoProfile === "Super Admin") {
              this.CondoResource.addUserToCondoOwners({'condoId': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }
          }).then(() => {
            this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
              if (this.residence.residenceProfile === "Residente") {
                this.CondoResource.setApproveUserToResidence({'condoId': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
              }

              if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                this.CondoResource.setVoterUserToResidence({'condoId': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
              }
            }).then(() => {
              this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
              this.close();
            });
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  filterUsers () {
    this.users = this.UserResource.query({'email' : this.filterUserTerm});
  }

  filterResidences () {
    this.CondoResource.getResidencesFromCondo({'condoId' : this.condo._id}).$promise.then(
      residences => {
        this.residences = residences.filter(
          residence => residence.identification.includes(this.filterResidenceTerm)
        );
      }
    );
  }

  chooseUser (user) {
    this.user = user
    this.filterUserTerm = user.firstName + " " + user.lastName;
    this.users = {};
  }

  chooseResidence (residence) {
    this.residence = residence;
    this.filterResidenceTerm = residence.identification;
    this.residences = {};
  }

  close () {
    this.modalInstance.dismiss();
  }
}
