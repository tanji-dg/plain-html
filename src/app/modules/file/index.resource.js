export let FileResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/files/:_id`;

  return $resource(baseUrl, {'_id' : '@_id'}, {

    'upload'                : {
      'method'                : 'POST',
      'url'                   : `${baseUrl}/upload`,
      'headers'               : {'Content-Type': undefined},
      'isArray'               : true
    }
  });
};
