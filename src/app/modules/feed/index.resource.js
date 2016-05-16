export let FeedResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}`;

  return $resource(baseUrl, {'_id' : '@_id'}, { }
    
  );
};
