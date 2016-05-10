export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condos`;

  return $resource(`${baseUrl}/:_id`, {'_id' : '@_id', 'userId' : '@userId'}, {
    'search' : {
      'method'       : 'GET',
      'isArray'      : true,
      'url'          : `${config.backendUrl}/api/_search/condos/:query`
    },
		'addUser'        : {
			'method'       : 'PUT',
			'url'          : `${baseUrl}/:_id/users/:userId`
		},
		'getResidences'  : {
			'method'       : 'GET',
			'url'          : `${baseUrl}/:_id/residences`
		},
		'addResidence'   : {
			'method'       : 'POST',
			'url'          : `${baseUrl}/:_id/residences`
		}
  });
};
