export class AuthService {

  constructor($http, config, localStorageService, Base64) {
    'ngInject';

    this.http = $http;
    this.base64 = Base64;
    this.backendUrl = config.backendUrl;
    this.localStorage = localStorageService;
  }

  login(username, password) {
    this.localStorage.remove('token');

    let token = this.base64.encode(username + ":" + password);

    // this.http.defaults.headers.common.Authorization = `Basic ${token}`;
    return this.http.get(`${this.backendUrl}/users/me`, {headers: {Authorization : `Basic ${token}`}}).success((response) => {
      this.localStorage.set('token', token);
      return response.data;
    });
    // var parameters = [
    //   `username=${encUsername}`,
    //   `password=${encPassword}`,
    //   `grant_type=password`,
    //   `scope=read%20write`,
    //   `client_secret=mySecretOAuthSecret`,
    //   `client_id=econdosapp`
    // ];
    //
    // return this.http.post(`${this.backendUrl}/oauth/token`, parameters.join('&'), {
    //   headers : {
    //     'Content-Type'  : 'application/x-www-form-urlencoded',
    //     'Accept'        : 'application/json',
    //     'Authorization' : `Basic ${this.base64.encode('econdosapp:mySecretOAuthSecret')}`
    //   }
    // }).success((response) => {
    //   var expiredAt = new Date();
    //   expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
    //   response.expires_at = expiredAt.getTime();
    //   this.localStorage.set('token', response);
    //   return response;
    // });
  }

  logout() {
    this.localStorage.clearAll();
    // this.http.post(`${this.backendUrl}/api/logout`).then(function () {
    //   this.localStorage.clearAll();
    // });
  }

  getToken() {
    return this.localStorage.get('token');
  }

  hasValidToken() {
    return this.getToken();
    // var token = this.getToken();
    // return token && token.expires_at && token.expires_at > new Date().getTime();
  }

}
