export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/condos`;

  return $resource(`${baseUrl}/:_id`, {'_id' : '@_id'}, {
    'search' : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${config.backendUrl}/_search/condos/:query`
    },
    'getUsers'                 : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/users`
    },
    'createUser'               : {
      'method'                 : 'POST',
      'url'                    : `${baseUrl}/:_id/users`
    },
    'addUser'                  : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/users/:userId`,
      'params'                 : {'userId' : '@userId'}
    },
    'removeLoggedUser'         : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/users/me`
    },
    'getResidences'            : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/residences`,
      'params'                 : {'$populate' : '@$populate'},
      'transformResponse'      : transformMultipleResidencesResponse
    },
    'getResidence'             : {
      'method'                 : 'GET',
      'url'                    : `${baseUrl}/:_id/residences/:residenceId`,
      'params'                 : {'residenceId' : '@residenceId', 'populate' : '@$populate'},
      'transformResponse'      : transformSingleResidenceResponse
    },
    'addResidence'             : {
      'method'                 : 'POST',
      'url'                    : `${baseUrl}/:_id/:condoId/residences`,
      'params'                 : {'condoId' : '@condoId'}
    },
    'addUserToResidence'       : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/residences/:residenceId/users/:userId`,
      'params'                 : {'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'rejectUserFromResidence'  : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/residences/:residenceId/users/:userId/reject`,
      'params'                 : {'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'removeUserFromResidence'  : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/:condoId/residences/:residenceId/users/:userId`,
      'params'                 : {'condoId' : '@condoId', 'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'updateResidence'          : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/residences/:residenceId`,
      'params'                 : {'residenceId' : '@residenceId'}
    },
    'clearResidenceVoter'     : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/residences/:residenceId`,
      'params'                 : {'condoId' : '@condoId', 'residenceId' : '@residenceId'}
    },
    'getOccurrences'           : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/occurrences`,
      'params'                 : {
        '$populate[0]'          : '_comments',
        '$populate[1][path]'    : 'pictures',
        '$populate[1][select]'  : 'url publicId thumbnail',
        '$populate[2]'          : 'favorVotes',
        '$populate[3]'          : 'againstVotes',
        '$populate[4][path]'    : 'createdBy',
        '$populate[4][select]'  : 'firstName lastName',
        '$deepPopulate'         : 'createdBy.picture',
        '$sort'                 : '-createdAt'
      }
    },
    'getOccurrence'            : {
      'method'                 : 'GET',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId`,
      'params'                 : {
        'occurenceId'           : '@occurrenceId',
        '$populate[0]'          : 'comments',
        '$populate[1][path]'    : 'createdBy',
        '$populate[1][select]'  : 'firstName lastName picture',
        '$populate[2]'          : 'favorVotes',
        '$populate[3]'          : 'againstVotes',
        '$populate[4]'          : 'pictures',
        '$sort'                 : '-createdAt'
      }
    },
    'addOccurrence'            : {
      'method'                 : 'POST',
      'url'                    : `${baseUrl}/:_id/occurrences`,
      'transformRequest'       : transformOccurrenceRequest
    },
    'removeOccurrence'         : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'uploadFiles'              : {
      'method'                 : 'POST',
      'url'                    : `${baseUrl}/:_id/files/upload`,
      'headers'                : {'Content-Type': undefined},
      'isArray'                : true
    },
    'likeOccurrence'           : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/like`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'undoLikeOccurrence'       : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/like`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'commentOccurrence'        : {
      'method'                 : 'POST',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/comments`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'getOccurrenceComments'    : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/comments`,
      'params'                 : {
        'occurreceId'                   : '@occurrenceId',
        '$limit'                        : 1000,
        '$populate[1][path]'            : 'createdBy',
        '$populate[1][select]'          : 'firstName lastName picture',
        '$populate[1][populate][path]'  : 'picture',
        '$populate[1][populate][select]': 'url publicId thumbnail',
        '$sort'       : '-createdAt'
      }
    },
    'voteForOccurrence'        : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/vote`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'voteAgainstOccurrence'    : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/occurrences/:occurrenceId/vote`,
      'params'                 : {'occurrenceId' : '@occurrenceId'}
    },
    'getUsersFromCondo'        : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/:condoId/users`,
      'params'                 : {'condoId' : '@condoId', '$populate' : '@$populate'}
    },
    'getResidencesFromCondo'   : {
      'method'                 : 'GET',
      'isArray'                : true,
      'url'                    : `${baseUrl}/:_id/:condoId/residences`,
      'params'                 : {'condoId' : '@condoId'}
    },
    'setApproveUserToResidence': {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/residences/:residenceId/users/:userId/approve`,
      'params'                 : {'condoId' : '@condoId', 'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'setVoterUserToResidence'       : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/residences/:residenceId/users/:userId/voter`,
      'params'                 : {'condoId' : '@condoId', 'residenceId' : '@residenceId', 'userId' : '@userId'}
    },
    'addUserToCondo'           : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/users/:userId`,
      'params'                 : {'condoId' : '@condoId', 'userId' : '@userId'}
    },
    'setApproveUserToCondo'    : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/users/:userId/approve`,
      'params'                 : {'condoId' : '@condoId', 'userId' : '@userId'}
    },
    'addUserToCondoAdmins'           : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/users/:userId/admins`,
      'params'                 : {'condoId' : '@condoId', 'userId' : '@userId'}
    },
    'addUserToCondoOwners'     : {
      'method'                 : 'PUT',
      'url'                    : `${baseUrl}/:_id/:condoId/users/:userId/owners`,
      'params'                 : {'condoId' : '@condoId', 'userId' : '@userId'}
    },
    'removeUserFromCondo'      : {
      'method'                 : 'DELETE',
      'url'                    : `${baseUrl}/:_id/:condoId/users/:userId`,
      'params'                 : {'condoId' : '@condoId', 'userId' : '@userId'}
    },
    'removeUserFromCondoAdmins': 'DELETE',
    'url'                      : `${baseUrl}/:_id/:condoId/users/:userId/admins`,
    'params'                   : {'condoId' : '@condoId', 'userId' : '@userId'}
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

  function transformOccurrenceRequest(occurrence) {
    // if(occurrence.pictures && occurrence.pictures.length) occurrence.pictures = occurrence.pictures.map((picture) => { return picture._id; });
    return angular.toJson(occurrence);
  }
};
