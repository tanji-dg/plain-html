export let UserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/users/:_id`;

  return $resource(baseUrl, {'_id': '@_id'}, {

    'register'               : {
      'method': 'POST',
      'url'   : `${baseUrl}`
    },
    'update'                 : {
      'method': 'PUT',
      'url'   : `${baseUrl}`
    },
    'getUser'                : {
      'method': 'GET',
      'url'   : `${baseUrl}`
    },
    'activate'               : {
      'method': 'PUT',
      'url'   : `${baseUrl}/:email/activate`,
      'params': {'activationKey': '@activationKey', 'email': '@email'}
    },
    'authenticate'           : {
      'method': 'GET',
      'url'   : `${baseUrl}/me`,
      'params': {
        '$populate[0]'        : 'picture',
        '$populate[1][path]'  : 'condos',
        '$populate[1][select]': 'name',
        '$populate[2][path]'  : 'condosRequester',
        '$populate[2][select]': 'name',
        '$populate[3][path]'  : 'condosAdmin',
        '$populate[3][select]': 'name',
        '$populate[4][path]'  : 'condosOwner',
        '$populate[4][select]': 'name',
        '$populate[5][path]'  : 'condosGatekeeper',
        '$populate[5][select]': 'name'
      }
    },
    'resetPassword'          : {
      'method': 'GET',
      'url'   : `${baseUrl}/:email/reset`,
      'params': {'email': '@email'}
    },
    'getNotifications'       : {
      'method' : 'GET',
      'isArray': true,
      'url'    : `${baseUrl}/me/notifications`,
      'params' : {
        '$limit'              : '5',
        '$populate[0][path]'  : 'createdBy',
        '$populate[0][select]': 'firstName lastName',
        '$sort'               : '-createdAt'
      }
    },
    'markNotificationsAsRead': {
      'method': 'PUT',
      'url'   : `${baseUrl}/me/notifications`
    },
    'createUser'             : {
      'method': 'POST',
      'url'   : `${baseUrl}`
    }
  });
};
