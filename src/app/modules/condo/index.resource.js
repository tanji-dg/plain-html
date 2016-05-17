export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/condos`;

  return $resource(`${baseUrl}/:_id`, {'_id' : '@_id'}, {
    'search' : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${config.backendUrl}/_search/condos/:query`
    },
    'createUser'           : {
      'method'             : 'POST',
      'url'                : `${baseUrl}/:_id/users`
    },
    'addUser'              : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/users/:userId`,
      'params'             : {'userId' : '@userId'}
    },
    'getResidences'        : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${baseUrl}/:_id/residences`,
      'params'             : {'populate' : '@$populate'},
      'transformResponse'  : transformMultipleResidencesResponse
    },
    'getResidence'         : {
      'method'             : 'GET',
      'url'                : `${baseUrl}/:_id/residences/:residenceId`,
      'params'             : {'residenceId' : '@residenceId', 'populate' : '@$populate'},
      'transformResponse'  : transformSingleResidenceResponse
    },
    'addResidence'         : {
      'method'             : 'POST',
      'url'                : `${baseUrl}/:_id/residences`
    },
    'addUserToResidence'      : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId/users/:userId`,
      'params'             : {'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'updateResidence'      : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId`,
      'params'             : {'residenceId' : '@residenceId'}
    }
  });

  function transformSingleResidenceResponse(response) {
    var residence = (response instanceof Object) ? response : angular.fromJson(response);
    residence.identification = (residence.identification === 0) ? '' : residence.identification;
    residence.residents = residence.users.concat(residence.requesters);
    return residence;
  }

  function transformMultipleResidencesResponse(response) {
    var residences = (response instanceof Array) ? response : angular.fromJson(response);
    residences = residences.map(transformSingleResidenceResponse);
    return residences;
  }
};
