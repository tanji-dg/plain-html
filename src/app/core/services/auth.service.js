export class AuthService {

  constructor($http, config, localStorageService, Base64, $q) {
    'ngInject';

    this.http = $http;
    this.base64 = Base64;
    this.backendUrl = config.backendUrl;
    this.localStorage = localStorageService;
    this.q = $q;
  }

  login(username, password) {
    let defer = this.q.defer();
    this.localStorage.remove('token');

    let token = this.base64.encode(username + ":" + password);

    this.http
      .get(`${this.backendUrl}/users/me`, {headers : {Authorization : `Basic ${token}`}})
      .success((response) => {
        this.localStorage.set('token', token);
        defer.resolve(response.data || response);
      })
      .catch(defer.reject);

    return defer.promise;

  }

  logout() {
    this.localStorage.clearAll();
  }

  getToken() {
    return this.localStorage.get('token');
  }

  hasValidToken() {
    return this.getToken();
  }

}
