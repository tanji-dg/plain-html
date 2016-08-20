export let ConfigBlock = (
    $logProvider, $uiViewScrollProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider,
    localStorageServiceProvider, angularPromiseButtonsProvider, cloudinaryProvider
  ) => {
  'ngInject';

  // $ionicConfigProvider.scrolling.jsScrolling(true);

  $.material.init();
  cloudinaryProvider.set("cloud_name", "econdos");


  localStorageServiceProvider
    .setPrefix('econdos')
    .setStorageType('sessionStorage')
    .setNotify(true, true);

  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('ErrorInterceptor');

  $logProvider.debugEnabled(true);
  $uiViewScrollProvider.useAnchorScroll();
  $urlRouterProvider.otherwise('/login');

  angularPromiseButtonsProvider.extendConfig({
    spinnerTpl: '<i class="fa fa-spinner fa-spin margin-bottom fa-promise-button"></i>',
    disableBtn: true,
    btnLoadingClass: 'is-loading',
    addClassToCurrentBtnOnly: false,
    disableCurrentBtnOnly: false
  });
};
