export let ConfigBlock = (
    $logProvider, $uiViewScrollProvider, $urlRouterProvider, $httpProvider, 
    localStorageServiceProvider, angularPromiseButtonsProvider
  ) => {
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

  angularPromiseButtonsProvider.extendConfig({
    spinnerTpl: '<i class="fa fa-spinner fa-spin margin-bottom fa-promise-button"></i>',
    disableBtn: true,
    btnLoadingClass: 'is-loading',
    addClassToCurrentBtnOnly: false,
    disableCurrentBtnOnly: false
  });
};
