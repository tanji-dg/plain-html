export let CondoUserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condoUsers`;

  return $resource(baseUrl, {}, {
    'remove' : {
      'method' : 'DELETE',
      'url'    : `${baseUrl}/:condoId/:userId`,
      'params' : {'condoId' : '@condoId', 'userId' : '@userId'}
    }
  });
};
