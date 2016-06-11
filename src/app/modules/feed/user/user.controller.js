export class FeedUserController {

  constructor($window, Session, $location) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.Session = Session;
    this.location = $location;

    this.user = this.Session.get();
  }

  save() {
    return this._.clone(this.user).$update().then(() => {
      this.swal("Dados Alterados", "Seus dados foram alterados com sucesso! ", "success");
    });
  }
}
