// Bug do ui-router https://github.com/angular-ui/ui-router/issues/105
// deve-se manter $state, $stateParams
export let RunBlock = ($timeout, Session, $state, $stateParams) => {
  'ngInject';
  Session.create();
};
