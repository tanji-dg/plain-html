export class FeedNavbarController {

  constructor($window,$location, Session, CondoService, UserResource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.Session = Session;
    this.CondoService = CondoService;
    this.UserResource = UserResource;
    this.location = $location;
    this.isCollapsed = true;

    this.user = this.Session.get();
    this.notifications = this.UserResource.getNotifications();

    this.getCondo();
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
}
