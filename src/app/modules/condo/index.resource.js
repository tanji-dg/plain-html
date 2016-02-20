export let CondoResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condos`;

  return $resource(baseUrl, {'id' : '@id'}, {});
};
