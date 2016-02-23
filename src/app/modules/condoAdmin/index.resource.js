export let CondoAdminResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/condoAdmin`;

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
