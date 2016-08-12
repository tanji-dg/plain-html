export let RunBlock = ($timeout, Session, $state, $stateParams) => { //Bug do ui-router https://github.com/angular-ui/ui-router/issues/105
  'ngInject';
  Session.create();
};
