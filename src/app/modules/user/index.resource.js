export let UserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/users/:_id`;

  return $resource(baseUrl, {'_id' : '@_id'}, {

    'register'             : {
      'method'             : 'POST',
      'url'                : `${baseUrl}`
    },
    'update'               : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}`
    },
    'activate'             : {
      'method'             : 'GET',
      'url'                : `${baseUrl}/:id/activate`,
      'params'             : {'activationKey' : '@key'}
    },
    'authenticate'         : {
      'method'             : 'GET',
      'url'                : `${baseUrl}/me`,
      'params'             : {'$populate' : '@$populate'}
    },
    'changePassword'       : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}`
    },
    'resetPasswordInit'    : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/reset`
    },
    'resetPasswordFinish'  : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/reset`
    },
    'getNotifications'     : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${baseUrl}/me/notifications`,
      'params'             : {'$limit' : '5', '$populate': 'users'}
    }
  });
};
