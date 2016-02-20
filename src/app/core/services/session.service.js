export class SessionService {

  constructor(Auth, AccountResource, $q, $location, localStorageService) {
    'ngInject';

    this.logged = null;

    this.q = $q;
    this.auth = Auth;
    this.token = localStorageService.get('token');
    this.account = AccountResource;
    this.location = $location;
  }

  create(username, password) {
    let defer = this.q.defer();

    let onSuccess = (account) => {
      let step = account.signupStep || 1;
      let url = (step === 0) ? '/timeline' : `/signup/${step}`;

      this.logged = account;
      this.location.url(url);
      defer.resolve(account);
    };

    let onError = (error) => {
      if (['/login', '/activate', '/signup'].indexOf(this.location.path()) === -1) {
        this.location.url('/login');
      }

      defer.reject(error);
    };

    if (username && password) {
      this.auth.login(username, password).then(() => {
        this.account.get().$promise.then(onSuccess, onError);
      }, onError);
    } else if (this.token) {
      this.account.get().$promise.then(onSuccess, onError);
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
