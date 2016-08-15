export class CondoModalsDeleteCondoUserController {

  constructor($window, CondoResource, Session, UserResource, $uibModalInstance) {
    'ngInject';

	this.window = $window;
    this._ = this.window._;
	this.swal = this.window.swal;
    this.user = new UserResource();
    this.Session = Session;
    this.UserResource = UserResource;
    this.CondoResource = CondoResource;
    this.modalInstance = $uibModalInstance;

    this.condo = this.Session.getCondo();
  }

  removeFromResidence(user) {
    this.swal({
      title: "Tem certeza que deseja excluir o usuário da residência?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
          if(user != this.user) {
            this.swal("Integrante Removido", "O integrante foi removido da residência com sucesso!", "success");
            let userIndex = this._.findIndex(users, {'_id': user._id});
            users.splice(userIndex, 1);
          } else {
            this.residence = {};
            this.swal.close();
            this.Session.refresh();
          }
        });
      }
    });
  }
  
  removeFromCondo(user) {
    this.swal({
      title: "Tem certeza que deseja excluir o usuário do condomínio?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.removeUserFromResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
          if(user != this.user) {
            this.swal("Integrante Removido", "O integrante foi removido do condomínio com sucesso!", "success");
            let userIndex = this._.findIndex(users, {'_id': user._id});
            users.splice(userIndex, 1);
          } else {
            this.residence = {};
            this.swal.close();
            this.Session.refresh();
          }
        });
      }
    });
  }

  close() {
    this.modalInstance.dismiss();
  }
}
