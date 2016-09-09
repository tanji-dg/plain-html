export class FeedUserController {

  constructor($window, $location, $scope, Session, FileResource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.Session = Session;
    this.FileResource = FileResource;
    this.location = $location;
    this.scope = $scope;
    this.date = new Date();
    this.user = this.Session.get();
    this.scope.uploadPicture = this.uploadPicture;
    this.scope.vm = this;
  }

  save() {
    return this._.clone(this.user).$update().then(() => {
      this.swal("Dados Alterados", "Seus dados foram alterados com sucesso! ", "success");
    });
  }

  uploadPicture (element) {
    var vm, fd, error;

    vm = this.vm;
    fd = new FormData();
    vm.uploading = true;

    vm.window._.forEach(element.files, (file) => {
      if (file.type.indexOf("image")) error = true;
      fd.append('file', file);
    });

    if (error) {
      vm.uploading = false;
      vm.window.swal("Ops!", "Você só pode enviar imagens!", "error");
    } else {
      vm.FileResource.upload(null, fd).$promise.then((files) => {
        vm.user.picture = files[0];
        vm.uploading = false;
      }, () => {
        vm.uploading = false;
        vm.window.swal("Ops!", "Não foi possível salvar esta imagen. \nPor favor, tente novamente mais tarde.", "error");
      });
    }
  }
}
