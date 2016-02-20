export let scrollToItem = () => {
  'ngInject';

  return {
    restrict : 'A',
    scope    : {
      scrollTo : "@"
    },
    link     : (scope, $elm) => {
      $elm.on('click', () => {
        angular.element('html,body').animate({scrollTop : angular.element(scope.scrollTo).offset().top}, "slow");
      });
    }
  };
}
