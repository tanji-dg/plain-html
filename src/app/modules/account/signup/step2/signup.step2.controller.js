export class AccountSignupStep2Controller {

  constructor ($location, $window, $q,
              Session, CondoResource, CondoModals, CondoService) {
    'ngInject';

    this.q = $q;
    this.swal = $window.swal;
    this.$location = $location;
    this.Session = Session;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.CondoService = CondoService;

    this.user = Session.get();
    this.condos = [];

    this.loading = false;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'$text[$search]': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  chooseCondo (condo) {
    this.CondoResource.addUser({'_id': condo._id, 'userId': this.user._id}).$promise.then(() => {
      this.Session.setCondo(condo).then(() => {
        this.$location.path('/feed');
        this.swal("Cadastro Finalizado", "Bem-vindo(a) ao seu condomínio!", "success");
      });
    });
  }

  createCondo () {
    return this.CondoModals.create().then((condo) => {
      this.chooseCondo(condo);
    });
  }
}
