export class AccountSignupStep0Controller {

  constructor(AccountResource, $location, $q) {
    'ngInject';

    this.account = new AccountResource();
    this.location = $location;
    this.q = $q;
  }

  save() {
    this.account.langKey = 'pt';
    this.account.email = this.account.login;
    this.account.baseUrl = this.location.absUrl().split('/#')[0];
    this.account.signupStep = 1;

    return this.account.$register().then(() => {
      this.success = true;
    });
  }
}
