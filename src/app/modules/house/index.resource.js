export let HouseResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/houses`;

  return $resource(baseUrl, {'id' : '@id'}, {});
};
