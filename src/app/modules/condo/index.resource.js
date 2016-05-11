export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condos`;

  return $resource(`${baseUrl}/:_id`, {'_id' : '@_id', 'userId' : '@userId', 'residenceId' : '@residenceId'}, {
    'search' : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${config.backendUrl}/api/_search/condos/:query`
    },
    'addUser'              : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/users`
    },
    'addLoggedUser'        : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/users/:userId`
    },
    'getResidences'        : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${baseUrl}/:_id/residences`,
      'transformResponse'  : transformMultipleResidencesResponse
    },
    'getResidence'         : {
      'method'             : 'GET',
      'url'                : `${baseUrl}/:_id/residences/:residenceId`,
      'transformResponse'  : transformSingleResidenceResponse
    },
    'addResidence'         : {
      'method'             : 'POST',
      'url'                : `${baseUrl}/:_id/residences`
    },
    'updateResidence'      : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId`
    }
  });

  function transformSingleResidenceResponse(response) {
    var residence = (response instanceof Object) ? response : angular.fromJson(response);
    residence.identification = (residence.identification === 0) ? '' : residence.identification;
    return residence;
  }

  function transformMultipleResidencesResponse(response) {
    var residences = (response instanceof Array) ? response : angular.fromJson(response);
    residences = residences.map(transformSingleResidenceResponse);
    return residences;
  }
};
