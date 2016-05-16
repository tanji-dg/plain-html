export class AuthInterceptor {

  constructor(localStorageService) {
    'ngInject';

    this.request = (config) => {

      var token = localStorageService.get('token');

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Basic ' + token;
      }
      // if (token && token.expires_at && token.expires_at > new Date().getTime()) {
      //   config.headers.Authorization = 'Basic ' + token.access_token;
      // }

      return config;
    }
  }
}
