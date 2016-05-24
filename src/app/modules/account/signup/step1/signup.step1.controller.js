export class AccountSignupStep1Controller {

  constructor(Session, $location) {
    'ngInject';

    this.user = Session.get();
    this.location = $location;
  }

  save() {
    this.user.signupStep = 2;
    return _.clone(this.user).$update().then(() => {
      this.location.path('/signup/2');
    });
  }
}
