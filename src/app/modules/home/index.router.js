export let routerConfig = ($stateProvider) => {
  'ngInject';

  $stateProvider.state('home', {
    'url'         : '/',
    'templateUrl' : 'app/modules/home/index.html'
  });
};
