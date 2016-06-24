export let routerConfig = ($stateProvider) => {
  'ngInject';

  $stateProvider.state('feed', {
    'url'         : '/feed',
    'templateUrl' : 'app/modules/feed/index.view.html'
  });

  $stateProvider.state('feedUser', {
    'url'         : '/meus-dados',
    'templateUrl' : 'app/modules/feed/user/user.view.html'
  });

  $stateProvider.state('feedCondos', {
    'url'         : '/meus-condominios',
    'templateUrl' : 'app/modules/feed/condos/condos.view.html'
  });

  $stateProvider.state('feedCondoResidents', {
    'url'         : '/:condoId/integrantes',
    'templateUrl' : 'app/modules/feed/residents/residents.view.html'
  });

};
