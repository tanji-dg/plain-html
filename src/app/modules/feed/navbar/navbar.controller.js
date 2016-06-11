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
    this.window.location.reload();
  }

  logOut () {
    this.Session.logout();
    this.location.path('/login');
  }

  getUnreadNotifications () {
    return this._.filter(this.notifications, { read: false }).length;
  }

  markNotificationsAsRead () {
    this.UserResource.markNotificationsAsRead().$promise.then(() => {
      this.UserResource.getNotifications().$promise.then((notifications) => {
        this.notifications = notifications;
      });
    });
  }
}
