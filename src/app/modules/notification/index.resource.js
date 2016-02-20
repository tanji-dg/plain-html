export let NotificationResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/api/notifications`;

  return $resource(baseUrl, {'id' : '@id'}, {});
};
