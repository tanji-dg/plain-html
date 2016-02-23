export let PersistenceAuditEventResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/persistenceAuditEvent`;

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
