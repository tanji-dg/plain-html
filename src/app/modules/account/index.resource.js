export let AccountResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/account`;

  return $resource(baseUrl, {'id' : '@id'}, {

    // register the user
    'register' : {
      'method' : 'POST',
      'url'    : `${config.backendUrl}/api/register`,
      'params' : {'baseUrl' : '@baseUrl'}
    },

    // activate the registered user
    'activate' : {
      'method' : 'GET',
      'url'    : `${config.backendUrl}/api/activate`,
      'params' : {'key' : '@key'}
    },

    // check if the user is authenticated, and return its
    'authenticate' : {
      'method' : 'GET',
      'url'    : `${config.backendUrl}/api/authenticate`
    },

    // changes the current user's password
    'changePassword' : {
      'method' : 'POST',
      'url'    : `${baseUrl}/change_password`
    },

    // reset user's password request
    'resetPasswordInit' : {
      'method' : 'POST',
      'url'    : `${baseUrl}/reset_password/init`
    },

    // reset user's password finish
    'resetPasswordFinish' : {
      'method' : 'POST',
      'url'    : `${baseUrl}/reset_password/finish`
    }
  });
};
