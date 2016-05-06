export class AccountSignupStep1Controller {

  constructor(Session, $location) {
    'ngInject';

    this.account = Session.get();
    this.location = $location;
  }

  save() {
    this.account.signupStep = 2;
    return this.account.$save().then(() => {
      this.location.path('/signup/2');
    });
  }
}
