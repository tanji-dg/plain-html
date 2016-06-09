export class AccountSignupStep0Controller {

  constructor(UserResource, $location, Session) {
    'ngInject';

    this.user = new UserResource();
    this.$location = $location;
    this.Session = Session;
  }

  save() {
    this.user.langKey = 'pt';
    this.user.email = this.user.login;
    this.user.baseUrl = this.$location.absUrl().split('/#')[0];
    this.user.signupStep = 1;

    return _.clone(this.user).$register().then(() => {
      this.Session.create(this.user.login, this.user.password).then(() => {
        this.$location.path('/signup/1');
      });
    }).catch(() => {
      swal('Este usuário já existe!', 'Tente utilizar outro e-mail.', "error");
   });
  }
}
