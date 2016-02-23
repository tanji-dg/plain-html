export let HouseResidentResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/houseResident`;

  return $resource(baseUrl, {'id' : '@id'}, {
    'login'  : {
      'method' : 'POST',
      'url'    : `${baseUrl}/login`
    },
    'signup' : {
      'method' : 'POST',
      'url'    : `${baseUrl}/signup`
    }
  });
};
