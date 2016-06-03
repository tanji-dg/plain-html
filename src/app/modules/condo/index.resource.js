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
    'removeLoggedUser'      : {
      'method'             : 'DELETE',
      'url'                : `${baseUrl}/:_id/users/me`
    },
    'getResidences'        : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${baseUrl}/:_id/residences`,
      'params'             : {'$populate' : '@$populate'},
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
    'addUserToResidence'   : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId/users/:userId`,
      'params'             : {'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'removeUserFromResidence'      : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId/users/:userId/reject`,
      'params'             : {'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'updateResidence'      : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/residences/:residenceId`,
      'params'             : {'residenceId' : '@residenceId'}
    },
    'getOccurrences'       : {
      'method'             : 'GET',
      'isArray'            : true,
      'url'                : `${baseUrl}/:_id/occurrences`,
      'params'             : {
        '$populate[0]'          : 'comments',
        '$populate[1][path]'    : 'createdBy',
        '$populate[1][select]'  : 'firstName lastName',
        '$sort'                 : '-createdAt'
      }
    },
    'getOccurrence'        : {
      'method'             : 'GET',
      'url'                : `${baseUrl}/:_id/occurrences/:occurrenceId`,
      'params'             : {
        'occurenceId'           : '@occurrenceId',
        '$populate[0]'          : 'comments',
        '$populate[1][path]'    : 'createdBy',
        '$populate[1][select]'  : 'firstName lastName',
        '$sort'                 : '-createdAt'
      }
    },
    'addOccurrence'        : {
      'method'             : 'POST',
      'url'                : `${baseUrl}/:_id/occurrences`
    },
    'removeOccurrence'     : {
      'method'             : 'DELETE',
      'url'                : `${baseUrl}/:_id/occurrences/:occurrenceId`,
      'params'             : {'occurrenceId' : '@occurrenceId'}
    },
    'likeOccurrence'       : {
      'method'             : 'PUT',
      'url'                : `${baseUrl}/:_id/occurrences/:occurrenceId/like`,
      'params'             : {'occurrenceId' : '@occurrenceId'}
    },
    'undoLikeOccurrence'   : {
      'method'             : 'DELETE',
      'url'                : `${baseUrl}/:_id/occurrences/:occurrenceId/like`,
      'params'             : {'occurrenceId' : '@occurrenceId'}
    },
    'commentOccurrence'    : {
      'method'             : 'POST',
      'url'                : `${baseUrl}/:_id/occurrences/:occurrenceId/comments`,
      'params'             : {'occurrenceId' : '@occurrenceId'}
    }
  });

  function transformSingleResidenceResponse(response) {
    var residence = (response instanceof Object) ? response : angular.fromJson(response);
    residence.identification = (residence.identification === 0) ? '' : residence.identification;
    residence.residents = _.unionBy(residence.users, residence.requesters, "_id");
    return residence;
  }

  function transformMultipleResidencesResponse(response) {
    var residences = (response instanceof Array) ? response : angular.fromJson(response);
    residences = residences.map(transformSingleResidenceResponse);
    return residences;
  }
};
