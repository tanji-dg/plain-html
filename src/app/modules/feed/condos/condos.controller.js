export class FeedCondosController {

  constructor ($location, $window, $q,
               Session, CondoResource, CondoModals, CondoService, UserResource) {
    'ngInject';

    this.Session = Session;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.CondoService = CondoService;
    this.UserResource = UserResource;

    this.user = this.UserResource.authenticate().$promise.then((user) => {
      console.log(user);
    });

    this.loading = false;
  }

  filterCondos () {
    this.loading = true;
    this.condos = this.CondoResource.query({'name': this.filterTerm});
    this.condos.$promise.then(() => {
      this.loading = false;
    });
  }

  addCondo (condo) {
    this.CondoService.set(condo);
  }

  createCondo () {
    return this.CondoModals.create().then((condo) => {
      //this.chooseCondo(condo);
    });
  }
}
