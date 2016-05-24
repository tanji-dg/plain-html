export class FeedCondosController {

  constructor ($location,
               Session, CondoResource, CondoModals, CondoService, UserResource) {
    'ngInject';

    this.Session = Session;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.CondoService = CondoService;
    this.UserResource = UserResource;

    this.user = this.Session.get();
    this.condo = this.CondoService.get();

    this.loading = false;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'$text[$search]': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  removeCondo (condo) {
    swal({
      title: "Tem certeza?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.removeUser({'_id': condo._id, 'userId': this.user._id}).$promise.then(() => {
          swal("Condomínio Removido", "O condomínio foi removido com sucesso!", "success");
        });
      }
    });
  }

  addCondo (condo) {
    this.CondoResource.addUser({'_id': condo._id, 'userId': this.user._id}).$promise.then(() => {
      swal("Condomínio Adicionado", "O condomínio foi adicionado com sucesso!", "success");
      this.user.condos.push(condo);
    });
  }

  createCondo () {
    this.CondoModals.create().then((condo) => {
      this.addCondo(condo);
    });
  }

  isAlreadyMine (condo) {
    return (_.findIndex(this.user.condos, {'_id': condo._id}) >= 0) ? true : false;
  }
}
