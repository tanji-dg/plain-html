export let ResidenceResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/residences`;

  return $resource(baseUrl, {'id' : '@id'}, {});
};
