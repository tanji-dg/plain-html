export let ConfigBlock = ($logProvider, $uiViewScrollProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) => {
  'ngInject';

  $.material.init();

  localStorageServiceProvider
    .setPrefix('econdos')
    .setStorageType('sessionStorage')
    .setNotify(true, true);

  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('ErrorInterceptor');

  $logProvider.debugEnabled(true);
  $uiViewScrollProvider.useAnchorScroll();
  $urlRouterProvider.otherwise('/');
};
