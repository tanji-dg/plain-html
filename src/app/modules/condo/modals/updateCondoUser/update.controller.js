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

    this.user = DataSource.user;
    this.residence = DataSource.residence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.currentResidenceId = this.residence._id;
    this.currentCondoProfile = this.user.condoProfile;
    this.currentResidenceProfile = this.residence.residenceProfile;

    this.userName = this.user.firstName + " " + this.user.lastName;

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

    this.condoProfiles = [
      "Síndico",
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

  updateUserFromCondo() {
    if (this.isUserResident || this.isCondoAdmin || this.isCondoOwner) {
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
          var updatePromise = new Promise( (resolve, reject) => {
            if (this.currentCondoProfile !== this.user.condoProfile) {
              this.CondoResource.removeUserFromCondoAdm({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
              this.CondoResource.removeUserFromCondo({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {
                //if (this.user.condoProfile === "Requisitante de Residência") {
                  this.CondoResource.addUserToCondo({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {});
                //}

                if (this.user.condoProfile === "Morador") {
                  this.CondoResource.setApproveUserToCondo({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {});
                }

                if ((this.isCondoOwner || this.isCondoAdmin) && this.user.condoProfile === "Admin") {
                  this.CondoResource.addUserToCondoAdmins({'_id' : this.condo._id, 'userId' : this.user._id}).$promise.then(() => {});
                }

                if (this.isCondoOwner && this.user.condoProfile === "Síndico") {
                  this.CondoResource.addUserToCondoOwners({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
                }
              });
            }

            if (this.currentResidenceId !== this.residence._id || this.currentResidenceProfile !== this.residence.residenceProfile) {
              if (this.user._id === this.residence.voter) {
                this.CondoResource.clearResidenceVoter({'_id': this.condo._id, 'residenceId' : this.currentResidenceId, 'voter' : null}).$promise.then(() => {});
              }

              if (this.currentResidenceId !== this.residence._id) {
                this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.currentResidenceId, 'userId': this.user._id}).$promise.then(() => {});

                this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                  if (this.residence.residenceProfile === "Residente") {
                    this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
                  }

                  if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                    this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
                  }
                });
              }
              else {
                if (this.residence.residenceProfile === "Requisitante") {
                  this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.currentResidenceId, 'userId': this.user._id}).$promise.then(() => {});
                  this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
                }

                if (this.residence.residenceProfile === "Residente") {
                  this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
                }

                if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                  this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {});
                }
              }
            }

            resolve('OK');
          }).then(() => {
            this.swal("Dados Atualizados", "A atualização foi realizada com sucesso!", "success");
            this.refWindow.load();
            this.close();
          }).catch((error) => {
            this.swal("Aviso", "Um erro ocorreu durante a atualização dos dados.", "warning");
            this.close();
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
    }
  }

  filterResidences () {
    this.CondoResource.getResidencesFromCondo({'_id' : this.condo._id}).$promise.then(
      residences => {
        this.residences = residences.filter(
          residence => residence.identification.includes(this.filterResidenceTerm)
        );
      }
    );
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
