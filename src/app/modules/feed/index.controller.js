export class FeedController {

  constructor($window, $location, Session, CondoResource, CondoService) {
    'ngInject';

    this.window = $window;
    this.swal = this.window.swal;
    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.Session = Session;

    this.user = this.Session.get();
    this.condo = this.Session.getCondo();

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
          occurrence.comments.unshift({description: occurrence.newComment, createdBy: this.user});
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
}
