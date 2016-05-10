export let UserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/users`;

  return $resource(`${baseUrl}/:_id`, {'_id' : '@_id'}, {});
};
