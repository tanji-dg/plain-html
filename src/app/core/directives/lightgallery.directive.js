export let lightgallery = () => {
  'ngInject';

  return {
    restrict: 'A',
    link: function(scope, element) {
      if (scope.$last) element.parent().lightGallery();
    }
  };
}
