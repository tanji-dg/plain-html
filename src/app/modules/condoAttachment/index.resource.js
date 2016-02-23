export let CondoAttachmentResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condoAttachment'`;

  return $resource(baseUrl, {}, {
    'remove' : {
      'method' : 'DELETE',
      'url'    : `${baseUrl}/:condoId/:userId`,
      'params' : {'condoId' : '@condoId', 'userId' : '@userId'}
    }
  });
};
