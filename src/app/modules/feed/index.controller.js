export class FeedController {

  constructor($scope, $window, $location, $q, $http, Upload, cloudinary, Session, CondoResource, CondoService, FileResource) {
    'ngInject';

    this.window = $window;
    this.swal = this.window.swal;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.FileResource = FileResource;
    this.Session = Session;
    this.scope = $scope;
    this.q = $q;
    this.http = $http;
    this.upload = Upload;
    this.cloudinary = cloudinary;

    this.user = this.Session.get();
    this.users = this.getUsers();
    this.condo = this.Session.getCondo();
    this.scope.uploadImages = this.uploadImages;
    this.scope.vm = this;

    this.getOccurrences();

  }

  getOccurrences () {
    this.occurrences = this.CondoResource.getOccurrences({'_id': this.condo._id});
  }

  addOccurrence () {
    return this.CondoResource.addOccurrence({'_id': this.condo._id}, this.occurrence).$promise.then(() => {
      this.swal("Publicado!", "Seu post foi enviado com sucesso.", "success");
      this.occurrence = {type: this.occurrence.type};
      this.getOccurrences();
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
    if (occurrence.liked) {
      this.CondoResource.undoLikeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.likes--;
        occurrence.liked = false;
        occurrence.isLoading = false;
      });
    } else {
      this.CondoResource.likeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.likes++;
        occurrence.liked = true;
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
          occurrence.comments.unshift({description: occurrence.newComment, createdBy: this.user, createdAt: new Date()});
          occurrence.commentsTotal++;
          occurrence.newComment = "";
        });
    } else {
      this.swal('Ops', 'Você precisa digitar no mínimo 3 caracteres!', 'error');
      return;
    }
  }

  allComments (occurrence) {
    return this.CondoResource.getOccurrenceComments({'_id' : this.condo._id, 'occurrenceId' : occurrence._id}).$promise.then((comments) => {
      occurrence.comments = comments;
      occurrence.isShowingAllComments = true;
    });
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

  uploadImages (element) {
    var vm, promises;

    vm = this.vm;
    promises = [];
    
    vm.FileResource.signature().$promise.then((server) => {
      vm.window._.forEach(element.files, function (file) {        
        var defered = vm.q.defer();

        file.upload = vm.upload.upload({
          url: server.url,
          transformRequest: function (data, headersGetter) {
            var headers = headersGetter();
            delete headers['Authorization'];
            return data;
          }
        }).progress(function (e) {

        }).success(function (data, status, headers, config) {
          defered.resolve();
        }).error(function (data, status, headers, config) {
          defered.reject();
        });

        promises.push(defered.promise);
      });

      vm.q.all(promises).then(function() {
        alert('success');
      });
    });
  }

  getUsers (query) {
    return this.CondoResource.getUsers({'_id': this.Session.getCondo()._id});
  }
}
