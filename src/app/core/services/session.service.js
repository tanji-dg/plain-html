export class SessionService {

  constructor(Auth, UserResource, $q, $location, $rootScope, localStorageService) {
    'ngInject';

    this.logged = null;

    this.q = $q;
    this.auth = Auth;
    this.token = localStorageService.get('token');
    this.user = UserResource;
    this.location = $location;

    this.resolve = () => {
      $rootScope.$resolved = true;
      if (!$rootScope.$$phase) $rootScope.$apply();
    }

  }

  create(username, password) {
    let defer = this.q.defer();

    let onSuccess = (user) => {
      let step = (user.signupStep === 0 || user.signupStep) ? user.signupStep : 1;
      let url = (step === 0) ? '/feed' : `/signup/${step}`;
      this.logged = user;
      this.location.url(url);
      this.resolve();

      defer.resolve(user);
    };

    let onError = (error) => {
      if (['/login', '/activate', '/signup'].indexOf(this.location.path()) === -1) {
        this.location.url('/');
      }

      this.resolve();
      defer.reject(error);
    };

    if (username && password) {
      this.auth.login(username, password).then(onSuccess, onError);
    } else if (this.token) {
      this.user.authenticate().$promise.then(onSuccess, onError);
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
}
