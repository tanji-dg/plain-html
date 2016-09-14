export class SessionService {

  constructor(Auth, UserResource, $window, $q, $cookies, $location, $rootScope, localStorageService) {
    'ngInject';

    this.logged = null;

    this.q = $q;
    this.auth = Auth;
    this.token = localStorageService.get('token');
    this.UserResource = UserResource;
    this.location = $location;
    this.cookies = $cookies;
    this.window = $window;

    this.resolve = () => {
      $rootScope.$resolved = true;
    };

    this.broadcast = (notification) => $rootScope.$broadcast(notification.type, notification);

  }

  create(username, password) {
    let defer = this.q.defer();
    this.isAuthentication = false;

    let onSuccess = (user) => {
      let step = (user.signupStep === 0 || user.signupStep) ? user.signupStep : 1;
      let url = (step === 0) ? '/feed' : `/signup/${step}`;
      this.logged = new this.UserResource(user);
      if (!this.isAuthentication) this.location.url(url);
      let broadcast = this.broadcast;

      if (user && user._id) this.auth.getPusher().subscribe(`private-user-${user._id}`).bind('notification', broadcast);
      if (user.defaultCondo) this.auth.getPusher().subscribe(`private-condo-${user.defaultCondo._id || user.defaultCondo}`).bind('notification', broadcast);

      this.window.plugins && this.window.plugins.OneSignal && this.window.plugins.OneSignal.sendTags && this.window.plugins.OneSignal.sendTags(user);
      this.resolve();
      defer.resolve(user);
    };

    let onError = (error) => {
      if (['/activate', '/signup', '/reset'].indexOf(this.location.path()) === -1) {
        this.location.url('/login');
      }

      this.resolve();
      defer.reject(error);
    };

    if (username && password) {
      this.auth.login(username, password).then(onSuccess, onError);
    } else if (this.token) {
      this.isAuthentication = true;
      this.UserResource.authenticate().$promise.then(onSuccess, onError);
    } else {
      onError('Not Authorized');
    }

    return defer.promise;
  }

  logout() {
    return this.auth.logout();
  }

  get () {
    return this.logged;
  }

  refresh () {
    return this.logged = this.UserResource.authenticate();
  }

  getCondo () {
    return this.window._.find(this.logged.condos, {_id: this.logged.defaultCondo});
  }

  setCondo (condo, onlyLocal) {
    var user = this.get();
    this.cookies.putObject('condo', condo);
    if (!onlyLocal) {
      return this.UserResource.update({_id: user._id}, {defaultCondo: condo._id, signupStep: 0}).$promise.then(() => {
        return this.UserResource.authenticate().$promise.then((user) => {
          return this.logged = user;
        });
      });
    }
  }

  isAdmin() {
    let user, condo;

    user = this.get();
    condo = this.getCondo();

    if (user && condo) {
      if (user.condosAdmin.length > 0) {
        return _.some(user.condosAdmin, {'_id' : condo._id});
      }

      if (user.condosOwner.length > 0) {
        return _.some(user.condosOwner, {'_id' : condo._id});
      }
    }

    return false;
  }

  isCondoAdmin(condo) {
    for (let c of this.logged.condosAdmin.entries())
    {
      if (c[1]._id === condo._id) return true;
    }

    return false;
  }

  isCondoOwner(condo) {
    for (let c of this.logged.condosOwner.entries())
    {
      if (c[1]._id === condo._id) return true;
    }

    return false;
  }
}
