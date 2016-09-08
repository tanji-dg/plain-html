export class NavbarService {

  constructor() {
    'ngInject';

    this.onCondoDeletionCallback;
  }

  onCondoDeletion(callback) {
      this.onCondoDeletionCallback = callback;
  }

  updateDefaultCondoOnNavbar(condo) {
      this.onCondoDeletionCallback(condo);
  }

}
