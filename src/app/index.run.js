export let RunBlock = ($timeout, $rootScope) => {
  'ngInject';
  // Session.create();
  $rootScope.$resolved = true;
  $timeout($.material.init);
};
