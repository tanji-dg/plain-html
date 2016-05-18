export class FeedNavbarController {

  constructor(Session, CondoService) {
    'ngInject';

    this.CondoService = CondoService;

    this.user = Session.get();

    this.setUpCondo();
  }

  setUpCondo () {
    this.getCondo();
    if(!this.condo._id) {
      this.CondoService.set(this.user.condos[0]);
    }
  }

  getCondo () {
    this.condo = this.CondoService.get();
  }

  chooseCondo (condo) {
    this.CondoService.set(condo);
    this.getCondo();
  }
}
