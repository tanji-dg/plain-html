export class AccountSignupStep1Controller {

  constructor(Session, $location, $scope, $window, FileResource) {
    'ngInject';

    this.user = Session.get();
    this.$location = $location;
    this.scope = $scope;
    this.window = $window;
    this.FileResource = FileResource;

    this.scope.uploadPicture = this.uploadPicture;
    this.scope.vm = this;
  }

  save() {
    this.user.signupStep = 2;
    return _.clone(this.user).$update().then(() => {
      this.$location.path('/signup/2');
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
