export class FeedNavbarController {

  constructor($window, Session, CondoService, UserResource) {
    'ngInject';

    this.Session = Session;
    this.CondoService = CondoService;
    this.UserResource = UserResource;
    this.$window = $window;

    this.user = this.Session.get();
    this.notifications = this.UserResource.getNotifications();

    this.getCondo();
  }

  getCondo () {
    this.condo = this.CondoService.get();
  }

  chooseCondo (condo) {
    this.CondoService.set(condo);
    this.getCondo();
    this.$window.location.reload();
  }

  logOut () {
    this.Session.logout();
    this.$window.location = '#/';
  }
}
