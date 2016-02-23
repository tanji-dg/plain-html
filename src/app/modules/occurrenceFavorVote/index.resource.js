export let OccurrenceFavorVoteResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/occurrenceFavorVote`;

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
