export class AuthInterceptor {

  constructor(localStorageService) {
    'ngInject';

    this.request = (config) => {

      config.headers = config.headers || {};
      var token = localStorageService.get('token');

      if (token && token.expires_at && token.expires_at > new Date().getTime()) {
        config.headers.Authorization = 'Bearer ' + token.access_token;
      }

      return config;
    }
  }
}
