export let CondoUserResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/condoUsers`;

  return $resource(baseUrl, {}, {});
};
