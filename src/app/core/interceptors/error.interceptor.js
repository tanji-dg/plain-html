export class ErrorInterceptor {

  constructor($window, $q, $location) {
    'ngInject';

    this.responseError = (rejection) => {

      let error400 = () => {
        let defaultMessage = 'Desculpe, tivemos um problema! Tente novamente ou entre em contato conosco.';
        let message = rejection.data ? rejection.data.error_description || rejection.data : defaultMessage;
        $window.swal('Ops...', message, 'error');
      };

      let error401 = () => {
        $location.url('/login');
        $window.swal('Ops...', 'Não foi possível realizar o login. \nVerifique seu e-mail e senha!', 'error');
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
