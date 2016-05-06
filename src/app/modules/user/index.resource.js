export let UserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/user`;

  return $resource(baseUrl, {'id' : '@id'}, {});
};
