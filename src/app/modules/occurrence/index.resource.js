export let OccurrenceResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/occurrence`;

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
