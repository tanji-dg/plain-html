export let AccountResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/users/:_id`;

  return $resource(baseUrl, {'_id' : '@_id'}, {

    // register the user
    'register' : {
      'method' : 'POST',
      'url'    : `${baseUrl}`
    },

    // update the user
    'update' : {
      'method' : 'PUT',
      'url'    : `${baseUrl}`
    },

    // activate the registered user
    'activate' : {
      'method' : 'GET',
      'url'    : `${baseUrl}/:id/activate`,
      'params' : {'activationKey' : '@key'}
    },

    // check if the user is authenticated, and return its
    'authenticate' : {
      'method' : 'GET',
      'url'    : `${baseUrl}/me`
    },

    // changes the current user's password
    'changePassword' : {
      'method' : 'PUT',
      'url'    : `${baseUrl}`
    },

    // reset user's password request
    'resetPasswordInit' : {
      'method' : 'PUT',
      'url'    : `${baseUrl}/reset`
    },

    // reset user's password finish
    'resetPasswordFinish' : {
      'method' : 'PUT',
      'url'    : `${baseUrl}/reset`
    }
  });
};
