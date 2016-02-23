export let CustomAuditEventResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/customAuditEvent`;

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
