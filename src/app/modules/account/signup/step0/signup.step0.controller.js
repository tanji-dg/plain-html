export class AccountSignupStep0Controller {

  constructor(AccountResource, $location) {
    'ngInject';

    this.account = new AccountResource();
    this.location = $location;
    this.success = false;
  }

  save() {
    this.account.langKey = 'pt';
    this.account.email = this.account.login;
    this.account.baseUrl = this.location.absUrl().split('/#')[0];

    this.account.$register().then(() => {
      this.success = true;
    });
  }
}
