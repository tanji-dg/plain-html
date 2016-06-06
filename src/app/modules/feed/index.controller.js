export class FeedController {

  constructor($location, Session, CondoResource, CondoService) {
    'ngInject';

    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.Session = Session;

    this.user = this.Session.get();

    this.setUpCondo();
    this.getOccurrences();

  }

  setUpCondo () {
    this.getCondo();
    if(!this.condo) this.CondoService.set(this.user.condos[0]);
  }

  getCondo () {
    this.condo = this.CondoService.get();
  }

  getOccurrences () {
    this.occurrences = this.CondoResource.getOccurrences({'_id': this.condo._id});
  }

  addOccurrence () {
    return this.CondoResource.addOccurrence({'_id': this.condo._id}, this.occurrence).$promise.then(() => {
      swal("Publicado!", "Seu post foi enviado com sucesso.", "success");
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
    return this.CondoResource.commentOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}, {description: occurrence.newComment}).$promise.then(() => {
      let occurrenceIndex = _.findIndex(this.occurrences, {'_id': occurrence._id});
      this.CondoResource.getOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then((occurrence) => {
        this.occurrences[occurrenceIndex] = occurrence;
      });
    });
  }

}
