export class FeedCondosController {

  constructor ($location, $window,
               Session, CondoResource, CondoModals, CondoService, UserResource, NavbarService) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.Session = Session;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.CondoService = CondoService;
    this.UserResource = UserResource;
    this.NavbarService = NavbarService;

    this.user = this.Session.get();
    this.condo = this.Session.getCondo();

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
    if (this.user.condos.length > 1) {
      this.swal({
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
          this.CondoResource.removeLoggedUser({'_id': condo._id}).$promise.then(() => {
            let condoIndex = this._.findIndex(this.user.condos, {'_id': condo._id});
            this.user.condos.splice(condoIndex, 1);

            this.Session.setCondo(this.user.condos[0]).then(() => {
              this.NavbarService.updateDefaultCondoOnNavbar(this.user.condos[0]);
              this.swal("Condomínio Removido", "O condomínio foi removido com sucesso!", "success");
            });
          });
        }
      });
    } else {
      this.swal("Ops!", "Adicione outro condomínio antes de remover o existente.", "error");
    }
  }

  addCondo (condo) {
    this.CondoResource.addUser({'_id': condo._id, 'userId': this.user._id}).$promise.then(() => {
      this.swal("Condomínio Adicionado", "O condomínio foi adicionado com sucesso!", "success");
      this.user.condos.push(condo);
    });
  }

  createCondo () {
    this.CondoModals.create().then((condo) => {
      this.addCondo(condo);
    });
  }

  isAlreadyMine (condo) {
    return (this._.findIndex(this.user.condos, {'_id': condo._id}) >= 0) ? true : false;
  }
}
