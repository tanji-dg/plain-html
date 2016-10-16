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
    this.item = DataSource.item;

    if (typeof this.item !== 'undefined') {
      this.residence = this.item.residence;
      this.chooseResidence(this.residence);
    }

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo._id);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);

    this.residenceProfiles = [
      "Proprietário(direito à voto)",
      "Residente",
      "Requisitante"
    ];
  }

  addResidenceToCondo() {
    if (typeof this.user === 'undefined' || typeof this.residence.residenceProfile === 'undefined' || typeof this.filterResidenceTerm === 'undefined') {
      this.swal("Dados Inválidos", "Preencha todos os campos!", "error");
      return;
    }

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
          if (this.residences.length === 0 || typeof this.residence._id === 'undefined') {
            this.CondoResource.addResidence({'_idCondo': this.condo._id, identification: this.filterResidenceTerm, type: 'APARTMENT'}).$promise.then((residence) => {
              this.residence._id = residence._id;
              if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
                this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                  this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                  this.refWindow.loadAllCollections();
                  this.close();
                });
              } else {
                this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                  if (this.residence.residenceProfile === "Residente") {
                    this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                      this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                      this.refWindow.loadAllCollections();
                      this.close();
                    }).catch(() => {
                      this.swal("Aviso", "Você já possui uma residência neste condomínio.", "warning");
                      this.refWindow.loadAllCollections();
                      this.close();
                    });
                  }
                }).then(() => {
                  this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                  this.refWindow.loadAllCollections();
                  this.close();
                });
              }
            });
          } else {
            if (this.residence.residenceProfile === "Proprietário(direito à voto)") {
              this.CondoResource.setVoterUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                this.refWindow.loadAllCollections();
                this.close();
              });
            } else {
              this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                if (this.residence.residenceProfile === "Residente") {
                  this.CondoResource.setApproveUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, 'userId': this.user._id}).$promise.then(() => {
                    this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                    this.refWindow.loadAllCollections();
                    this.close();
                  }).catch(() => {
                    this.swal("Aviso", "Você já possui uma residência neste condomínio.", "warning");
                    this.refWindow.loadAllCollections();
                    this.close();
                  });
                }
              }).then(() => {
                this.swal("Adição Concluída", "A adição foi realizada com sucesso!", "success");
                this.refWindow.loadAllCollections();
                this.close();
              });
            }
          }
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

  close () {
    this.modalInstance.dismiss();
  }
}
