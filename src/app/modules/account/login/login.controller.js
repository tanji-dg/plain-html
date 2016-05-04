export class AccountLoginController {

  constructor(Session) {
    'ngInject';

    this.session = Session;
  }

  login() {
    return this.session.create(this.account.login, this.account.password);
  }
}

