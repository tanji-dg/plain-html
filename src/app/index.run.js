export let RunBlock = ($timeout, Session) => {
  'ngInject';
  Session.create();
  $timeout($.material.init);
};
