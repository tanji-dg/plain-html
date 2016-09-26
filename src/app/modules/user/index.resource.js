export let UserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/users/:_id`;

  return $resource(baseUrl, {'_id' : '@_id'}, {

    'register'                : {
      'method'                : 'POST',
      'url'                   : `${baseUrl}`
    },
    'update'                  : {
      'method'                : 'PUT',
      'url'                   : `${baseUrl}`
    },
    'activate'                : {
      'method'                : 'PUT',
      'url'                   : `${baseUrl}/:email/activate`,
      'params'                : {'activationKey' : '@activationKey', 'email' : '@email'}
    },
    'authenticate'            : {
      'method'                : 'GET',
      'url'                   : `${baseUrl}/me`,
      'params'                : {
        '$populate[0]'          : 'picture'
      }
    },
    'resetPassword'           : {
      'method'                : 'GET',
      'url'                   : `${baseUrl}/:email/reset`,
      'params'                : {'email' : '@email'}
    },
    'getNotifications'        : {
      'method'                : 'GET',
      'isArray'               : true,
      'url'                     : `${baseUrl}/me/notifications`,
      'params'                  : {
        '$limit'                : '5',
        '$populate[0][path]'    : 'createdBy',
        '$populate[0][select]'  : 'firstName lastName',
        '$sort'                 : '-createdAt'
      }
    },
    'markNotificationsAsRead' : {
      'method'                : 'PUT',
      'url'                   : `${baseUrl}/me/notifications`
    },
    'createUser'              : {
      'method'                : 'POST',
      'url'                   : `${baseUrl}`
    }
  });
};
