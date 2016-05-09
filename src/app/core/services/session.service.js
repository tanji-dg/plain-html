export class SessionService {

  constructor(Auth, AccountResource, $q, $location, $rootScope, localStorageService) {
    'ngInject';

    this.logged = null;

    this.q = $q;
    this.auth = Auth;
    this.token = localStorageService.get('token');
    this.account = AccountResource;
    this.location = $location;

    this.resolve = () => {
      $rootScope.$resolved = true;
      $rootScope.$apply();
    }

  }

  create(username, password) {
    let defer = this.q.defer();

    let onSuccess = (account) => {
      let step = account.signupStep || 1;
      let url = (step === 0) ? '/timeline' : `/signup/${step}`;

      this.logged = account;
      this.location.url(url);
      this.resolve();

      defer.resolve(account);
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
      this.account.authenticate().$promise.then(onSuccess, onError);
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
