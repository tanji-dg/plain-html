export let CustomJpaResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/customJpa`;

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
