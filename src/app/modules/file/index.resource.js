export let FileResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/files`;

  return $resource(baseUrl, {'_id' : '@_id'}, {
    'signature'     : {
      'method'  : 'GET',
      'url'     : `${baseUrl}/signature`
    }
  });
};
