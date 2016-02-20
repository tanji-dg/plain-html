export let $mock = ($httpBackend, config) => {
  'ngInject';

  let httpBackend = angular.copy($httpBackend);
  let headers = {
    'Accept'       : 'application/json, text/plain, */*',
    'Content-Type' : 'application/json;charset=utf-8',
    'app_token'    : 'tOkEn'
  };

  httpBackend.headers = {
    'get'  : {
      'Accept'    : headers['Accept'],
      'app_token' : headers['app_token']
    },
    'post' : {
      'Accept'       : headers['Accept'],
      'Content-Type' : headers['Content-Type'],
      'app_token'    : headers['app_token']
    },
    'put' : {
      'Accept'       : headers['Accept'],
      'Content-Type' : headers['Content-Type'],
      'app_token'    : headers['app_token']
    }
  };

  httpBackend.backendUrl = config.backendUrl;

  httpBackend
    .whenPOST(`${httpBackend.backendUrl}/application/token`)
    .respond(200, {'token' : httpBackend.headers.post.app_token});

  return httpBackend;
};
