export let routerConfig = ($stateProvider) => {
  'ngInject';

  $stateProvider.state('feed', {
    'url'         : '/feed',
    'templateUrl' : 'app/modules/feed/index.view.html'
  });

};
