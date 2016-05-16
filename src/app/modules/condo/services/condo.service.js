export class CondoService {

  constructor($cookies) {
    'ngInject';

    this.cookies = $cookies;
  }

  get () {
    return this.cookies.getObject('condo');
  }

  set (condo) {
    this.cookies.putObject('condo', condo);
  }
}
