export class FeedController {

  constructor($scope, $window, $location, $rootScope, $q, $http, $sce, $timeout,
              Upload, cloudinary, Session, CondoResource, CondoService, $state) {
    'ngInject';

    this.window = $window;
    this.timeout = $timeout;
    this.state = $state;
    this.swal = this.window.swal;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.Session = Session;
    this.scope = $scope;
    this.q = $q;
    this.http = $http;
    this.upload = Upload;
    this.cloudinary = cloudinary;

    this.condo = this.Session.getCondo();

    if(!this.condo) {
      var that = this;
      this.window.swal({
        title: "Ops!",
        text: "Você não possui nenhum condomínio adicionado.",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#FFA90C",
        confirmButtonText: "Escolher um condomínio"
      }, function(){
        that.window.location.href = '#/meus-condominios';
      });
      return;
    }

    this.user = this.Session.get();
    this.users = this.getUsers();
    this.scope.uploadPictures = this.uploadPictures;
    this.scope.vm = this;

    this.getOccurrences();

    this.resolve = () => {
      $rootScope.$resolved = true;
    };

    let findOccurrence = notification => {
      let occurrenceId = notification.occurrence._id || notification.occurrence;
      return this.occurrences.find(o => o._id == occurrenceId);
    };

    let onOccurrenceNew = $rootScope.$on('OCCURRENCE-NEW', (event, notification) => {
      this.occurrences.unshift(notification.occurrence);
      $rootScope.$apply();
    });

    let onOccurrenceLike = $rootScope.$on('OCCURRENCE-LIKE', (event, notification) => {
      let occurrence = findOccurrence(notification);
      let index = occurrence.likers.indexOf(notification.createdBy);
      if (index == -1) {
        occurrence.likers.push(notification.createdBy);
        $rootScope.$apply();
      }
    });

    let onOccurrenceDislike = $rootScope.$on('OCCURRENCE-DISLIKE', (event, notification) => {
      let occurrence = findOccurrence(notification);
      let index = occurrence.likers.indexOf(notification.createdBy);
      if (index > -1) {
        occurrence.likers.splice(index, 1);
        $rootScope.$apply();
      }
    });

    let onCommentNew = $rootScope.$on('COMMENT-NEW', (event, notification) => {
      let occurrence = findOccurrence(notification);
      occurrence.comments = occurrence.comments || [];
      occurrence.comments.unshift(notification.comment);
      occurrence.commentsTotal = occurrence.comments.length;
      $rootScope.$apply();
    });

    $scope.$on('$destroy', function () {
      onOccurrenceNew();
      onOccurrenceLike();
      onOccurrenceDislike();
      onCommentNew();
    });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }
  }

  getOccurrences () {
    this.occurrences = this.CondoResource.getOccurrences({'_id': this.condo._id});
    this.occurrences.$promise.then(() => this.occurrences.$resolved = true);
  }

  addOccurrence () {
    return this.CondoResource.addOccurrence({'_id': this.condo._id}, this.occurrence).$promise.then(() => {
      this.swal("Publicado!", "Sua postagem foi recebida com sucesso.", "success");
      this.occurrence = {type: this.occurrence.type};
      this.state.transitionTo('feed');
    });
  }

  setOccurrenceType (type) {
    if (this.occurrence) {
      this.occurrence.type = type;
    } else {
      this.occurrence = {type: type};
    }
  }

  likeOccurrence (occurrence) {
    occurrence.isLoading = true;
    if (occurrence.likers.indexOf(this.user._id) > -1) {
      this.CondoResource.undoLikeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.isLoading = false;
      });
    } else {
      this.CondoResource.likeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.isLoading = false;
      });
    }
  }

  commentOccurrence (occurrence) {
    if (occurrence.newComment && occurrence.newComment.length > 2) {
      return this.CondoResource.commentOccurrence(
        {'_id': this.condo._id, 'occurrenceId': occurrence._id},
        {description: occurrence.newComment}
      ).$promise.then(() => {
          occurrence.newComment = "";
        });
    } else {
      this.swal('Ops', 'Você precisa digitar no mínimo 3 caracteres!', 'error');
      return;
    }
  }

  showComments (occurrence) {
    occurrence.$resolved = false;
    return this.CondoResource.getOccurrenceComments({'_id' : this.condo._id, 'occurrenceId' : occurrence._id}).$promise.then((comments) => {
      occurrence.comments = comments;
      // this.timeout(() => occurrence.$resolved = true, 500);
    });
  }

  hideComments (occurrence) {
    occurrence.comments = occurrence.comments.slice(0, 3);
  }

  voteOccurrence (occurrence, isFor) {
    var that, occurrenceIndex;

    that = this;

    if (!this.user.defaultResidence) {
      this.window.swal({
        title: "Selecione uma Residência",
        text: "Para votar, é obrigatório que você escolha a sua residência neste condomínio!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Selecionar"
      }, function(){
        that.window.location.href = '#/' + that.condo._id + '/integrantes';
      });
    } else {
      occurrence.isVoting = true;
      occurrenceIndex = this.window._.findIndex(this.occurrences, {_id: occurrence._id});

      if (isFor === true) {
        this.CondoResource.voteForOccurrence({'_id' : this.condo._id, 'occurrenceId' : occurrence._id}).$promise.then(() => {
          this.CondoResource.getOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then((o) => {
            this.occurrences[occurrenceIndex] = o;
          });
        });
      } else {
        this.CondoResource.voteAgainstOccurrence({'_id' : this.condo._id, 'occurrenceId' : occurrence._id}).$promise.then(() => {
          this.CondoResource.getOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then((o) => {
            this.occurrences[occurrenceIndex] = o;
          });
        });
      }
    }
  }

  findOccurrenceVote (votes) {
    return this.window._.find(votes, {voter: this.user._id});
  }

  uploadPictures (element) {
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
      vm.CondoResource.uploadFiles({'_id': vm.condo._id}, fd).$promise.then((files) => {
        if (vm.occurrence.pictures) vm.occurrence.pictures = vm.occurrence.pictures.concat(files);
        else vm.occurrence.pictures = files;
        vm.uploading = false;
      }, () => {
        vm.uploading = false;
        vm.window.swal("Ops!", "Não foi possível salvar esta(s) imagen(s). \nPor favor, tente novamente mais tarde.", "error");
      });
    }
    element.value = null;
  }

  removePicture (index) {
    this.occurrence.pictures.splice(index, 1);
  }

  getUsers (query) {
    return this.CondoResource.getUsers({'_id': this.Session.getCondo()._id, '$text[$search]': query}).$promise.then((users) => {
      return this.window._.map(users, (user) => {
        user.name = user.firstName + ' ' + user.lastName;
        return user;
      });
    });
  }
}
