export class AccountResetController {

  constructor ($window, $location, $stateParams, Session, UserResource) {
    'ngInject';

    this.Session = Session;
    this.window = $window;
    this.location = $location;
    this.stateParams = $stateParams;
    this.UserResource = UserResource;
  }

  reset () {
    return this.UserResource.activate({email: this.user.email, activationKey: this.stateParams.activationKey}, {password: this.user.password}).$promise.then(() => {
      this.window.swal("Senha Alterada!", "Faça o login novamente.", "success");
      this.location.path('/login');
    }, () => {
      this.window.swal("Ops!", "Não foi possível alterar a sua senha. \n Verifique se o seu e-mail foi digitado corretamente.", "error");
      this.location.path('/reset/' + this.stateParams.activationKey);
    });   
  }
}

