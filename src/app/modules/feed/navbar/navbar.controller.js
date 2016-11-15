export class FeedNavbarController {

  constructor($window,$location, Session, CondoService, UserResource, $state, NavbarService) {
    'ngInject';

    this.window = $window;
    this.state = $state;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.Session = Session;
    this.CondoService = CondoService;
    this.UserResource = UserResource;
    this.location = $location;
    this.isCollapsed = true;
    this.NavbarService = NavbarService;

    this.user = this.Session.get();
    this.notifications = this.UserResource.getNotifications();

    this.getCondo();
    this.NavbarService.onCondoDeletion((condo) => {this.condo = condo;});

    this.showCondoGate();
  }

  getCondo () {
    this.condo = this.Session.getCondo();
  }

  chooseCondo (condo) {
    this.Session.setCondo(condo).then(() => {
      this.window.location.reload();
    });
  }

  logOut () {
    this.Session.logout();
    this.location.path('/login');
  }

  getUnreadNotifications () {
    return this._.filter(this.notifications, { read: false }).length;
  }

  markNotificationsAsRead () {
    this.UserResource.markNotificationsAsRead();
  }

  showCondoGate() {
    let allowedCondoProfile = [].concat(
      this.user.condosAdmin, 
      this.user.condosOwner, 
      this.user.condosGateKeeper
    );

    allowedCondoProfile = allowedCondoProfile.filter(function(e){return e});
    return allowedCondoProfile.length != 0 && allowedCondoProfile.findIndex(c => c._id == this.condo._id) != -1;
  }
}
