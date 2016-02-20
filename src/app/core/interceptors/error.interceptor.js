export class ErrorInterceptor {

  constructor($window, $q, $location, localStorageService) {
    'ngInject';

    this.responseError = (rejection) => {

      let error400 = () => {
        let defaultMessage = 'Sorry! An error has ocurred, please try again or contact us.';
        let message = rejection.data ? rejection.data.error_description || rejection.data : defaultMessage;
        $window.swal('Ops...', message, 'error');
      };

      let error401 = () => {
        $location.url('/login');
        $window.swal('Ops...', 'Not authorized!', 'error');
      };

      switch (rejection.status) {
        case 400:
          error400();
          break;
        case 401:
          error401();
          break;
      }

      return $q.reject(rejection);
    }
  }
}
