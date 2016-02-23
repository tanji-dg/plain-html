export let CondoEntityResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condoEntity`;

  return $resource(baseUrl, {}, {
    'remove' : {
      'method' : 'DELETE',
      'url'    : `${baseUrl}/:condoId/:userId`,
      'params' : {'condoId' : '@condoId', 'userId' : '@userId'}
    }
  });
};
