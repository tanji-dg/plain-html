export class AuthService {

  constructor ($http, config, localStorageService, Base64, $q, $window) {
    'ngInject';

    this.http = $http;
    this.base64 = Base64;
    this.backendUrl = config.backendUrl;
    this.pusherAppKey = config.pusherAppKey;
    this.localStorage = localStorageService;
    this.q = $q;
    this.window = $window;
    this.pusher = null;
  }

  login (username, password) {
    let defer = this.q.defer();
    this.localStorage.remove('token');

    let token = this.base64.encode(username + ":" + password);

    this.http
      .get(`${this.backendUrl}/users/me?$populate=condos condosRequester condosAdmin condosOwner condosGatekeeper defaultCondo`, {headers: {Authorization: `Basic ${token}`}})
      .success((response) => {
        this.localStorage.set('token', token);
        defer.resolve(response.data || response);
      })
      .catch(defer.reject);

    return defer.promise;

  }

  logout () {
    this.localStorage.clearAll();
  }

  getToken () {
    return this.localStorage.get('token');
  }

  hasValidToken () {
    return this.getToken();
  }

  getPusher () {
    this.pusher = this.pusher || new this.window.Pusher(this.pusherAppKey, {
      authEndpoint: `${this.backendUrl}/users/me/notifications/pusher/auth`,
      auth        : {
        headers: {Authorization: `Basic ${this.getToken()}`}
      }
    });
    return this.pusher;
  }

}
