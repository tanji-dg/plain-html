export class AccountSignupStep0Controller {

  constructor(AccountResource, $location, Session) {
    'ngInject';

    this.account = new AccountResource();
    this.location = $location;
    this.Session = Session;
  }

  save() {
    this.account.langKey = 'pt';
    this.account.email = this.account.login;
    this.account.baseUrl = this.location.absUrl().split('/#')[0];
    this.account.signupStep = 1;

    return this.account.$register().then(() => {
      this.Session.create(this.account.login, this.account.password);
      this.success = true;
    });
  }
}
