export class AccountLoginController {

  constructor(Session) {
    'ngInject';

    this.Session = Session;
  }

  login() {
    return this.Session.create(this.account.login, this.account.password);
  }
}

