export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condos`;

  return $resource(baseUrl, {'id' : '@id'}, {
    'search' : {
      'method'  : 'GET',
      'isArray' : true,
      'url'     : `${config.backendUrl}/api/_search/condos/:query`
    }
  });
};
