export class AccountActivateController {

  constructor(AccountResource, $stateParams) {
    'ngInject';

    this.success = false;
    this.account = AccountResource.activate({'key' : $stateParams.key});

    this.account.$promise.then(() => {
      this.success = true;
    });
  }
}
