export class AccountLoginController {

  constructor ($window, $location, Session, UserResource) {
    'ngInject';

    this.Session = Session;
    this.window = $window;
    this.UserResource = UserResource;
  }

  login () {
    return this.Session.create(this.user.login, this.user.password);
  }

  resetPassword () {
    if (this.user && this.user.login) {
      return this.UserResource.resetPassword({email: this.user.login}).$promise.then(() => {
        this.window.swal("Senha Alterada!", "Criamos uma nova senha provisória \ne enviamos para o seu e-mail.", "success");
      }, () => {
        var that = this;
        this.window.swal({
          title: "Ops!",   
          text: "Não encontramos o seu e-mail. \nAproveite para criar a sua conta!",   
          type: "error",   
          showCancelButton: true,   
          cancelButtonText: "Fechar", 
          confirmButtonColor: "#FFA90C",   
          confirmButtonText: "Criar minha conta"
        }, function(){   
          that.window.location.href = '#/signup';
        });
      });   
    } else {
      this.window.swal("Ops!", "Preencha o seu e-mail!", "error");   
    }
  }
}

