export let CommentLikerResource = ($resource, config) => {
  'ngInject';

  let baseUrl = `${config.backendUrl}/commentLiker`;

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
