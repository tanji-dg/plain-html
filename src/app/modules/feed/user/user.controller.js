export class FeedUserController {

  constructor(Session, $location) {
    'ngInject';

    this.Session = Session;
    this.location = $location;

    this.user = this.Session.get();
  }

  save() {
    return _.clone(this.user).$update();
  }
}
