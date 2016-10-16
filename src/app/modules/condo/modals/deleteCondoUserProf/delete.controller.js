export class CondoModalsDeleteCondoUserProfController {

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
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.loggedUser = this.Session.get();
    this.isCondoAdmin = this.Session.isCondoAdmin(this.condo._id);
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);
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
          this.CondoResource.removeUserFromCondoAdm({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {
            this.CondoResource.removeUserFromCondo({'_id' : this.condo._id, 'userId': this.user._id}).$promise.then(() => {
              this.swal("Integrante Removido", "O integrante foi removido do condomínio com sucesso!", "success");
              this.refWindow.loadAllCollections();
              this.close();
            });
          });
        }
      });
    } else {
      this.swal("Aviso", "Você não tem permissão para executar está ação.", "warning");
      this.close();
    }
  }

  close() {
    this.modalInstance.dismiss();
  }
}
