export class SessionService {

  constructor(Auth, UserResource, CondoService, $q, $location, $rootScope, localStorageService) {
    'ngInject';

    this.logged = null;

    this.q = $q;
    this.auth = Auth;
    this.token = localStorageService.get('token');
    this.UserResource = UserResource;
    this.CondoService = CondoService;
    this.location = $location;

    this.resolve = () => {
      $rootScope.$resolved = true;
    }

  }

  create(username, password) {
    let defer = this.q.defer();

    let onSuccess = (user) => {
      let step = (user.signupStep === 0 || user.signupStep) ? user.signupStep : 1;
      let url = (step === 0) ? '/feed' : `/signup/${step}`;
      this.logged = new this.UserResource(user);
      this.location.url(url);
      this.resolve();

      defer.resolve(user);
    };

    let onError = (error) => {
      if (['/activate', '/signup'].indexOf(this.location.path()) === -1) {
        this.location.url('/login');
      }

      this.resolve();
      defer.reject(error);
    };

    if (username && password) {
      this.auth.login(username, password).then(onSuccess, onError);
    } else if (this.token) {
      this.UserResource.authenticate().$promise.then(onSuccess, onError);
    } else {
      onError('Not Authorized');
    }

    return defer.promise;
  }

  logout() {
    return this.auth.logout();
  }

  get() {
    return this.logged;
  }

  isAdmin() {
    let user, condo;

    user = this.get();
    condo = this.CondoService.get();

    if (user && condo) {
      if (user.condosAdmin.length > 0) {
        return _.some(user.condosAdmin, {'_id' : condo._id});
      }

      if (user.condosAdmin.length > 0) {
        return _.some(user.condosOwner, {'_id' : condo._id});
      }
    }

    return false;
  }
}
