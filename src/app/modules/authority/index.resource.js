export let AuthorityResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/authority`;

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
