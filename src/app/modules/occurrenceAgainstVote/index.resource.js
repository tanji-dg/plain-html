export let OccurrenceAgainstVoteResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/occurrenceAgainstVote`;

  return $resource(baseUrl, {'id' : '@id'}, {
    'login'  : {
      'method' : 'POST',
      'url'    : `${baseUrl}/login`
    },
    'signup' : {
      'method' : 'POST',
      'url'    : `${baseUrl}/signup`
    }
  });
};
