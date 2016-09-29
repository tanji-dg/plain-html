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
    this.refWindow = DataSource.refWindow;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo);

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

    this.showInvite = true;
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
              this.CondoResource.setApproveUserToCondo({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }

            if ((this.isCondoOwner || this.isCondoAdmin) && this.user.condoProfile === "Admin") {
              this.CondoResource.addUserToCondoAdmins({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }

            if (this.isCondoOwner && this.user.condoProfile === "Síndico") {
              this.CondoResource.addUserToCondoOwners({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() => {});
            }
          }).then(() => {
            if (this.residences.length === 0)
            {
              this.CondoResource.addResidence({
                '_id': this.condo._id,
                identification: this.filterResidenceTerm
              }).$promise.then((residence) => {
                this.residence._id = residence._id;
                this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                  if (this.residence.residenceProfile === "Residente") {
                    this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                      this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                      this.refWindow.load();
                      this.close();
                    }).catch((error) => {
                      this.swal("Aviso", "Você já possui uma residência neste condomínio.", "warning");
                      this.close();
                    });
                  }

                  if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                    this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                      this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                      this.refWindow.load();
                      this.close();
                    });
                  }
                });
              });
            }
            else
            {
              this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                if (this.residence.residenceProfile === "Residente") {
                  this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                    this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                    this.refWindow.load();
                    this.close();
                  }).catch((error) => {
                    this.swal("Aviso", "Você já possui uma residência neste condomínio.", "warning");
                    this.close();
                  });
                }

                if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                  this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                    this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                    this.refWindow.load();
                    this.close();
                  });
                }
              }).then(() => {
                this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                this.refWindow.load();
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

  filterUsers () {
    this.users = this.UserResource.query({'email' : this.filterUserTerm});
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

  chooseUser (user) {
    this.user = user;
    this.filterUserTerm = user.firstName + " " + user.lastName;
    this.showInvite = false;
    this.users = {};
  }

  chooseResidence (residence) {
    this.residence = residence;
    this.filterResidenceTerm = residence.identification;
    this.residences = {};
  }

  createUser() {
    return this.UserResource.createUser({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.filterUserTerm
    }).$promise.then((user) => {
      user.firstName = this.user.firstName;
      user.lastName = this.user.lastName;
      user.email = this.filterUserTerm;
      this.close();
    });
  }

  close () {
    this.modalInstance.dismiss();
  }
}
