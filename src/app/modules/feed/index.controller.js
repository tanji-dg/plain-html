export class FeedController {

  constructor($location, CondoResource, CondoService) {
    'ngInject';

    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;

    this.condo = this.CondoService.get();
    this.occurrences = this.CondoResource.getOccurrences({'_id': this.condo._id});
  }

  like(occurrence) {
    if(occurrence.liked) {
      this.CondoResource.undoLikeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.likes--;
        occurrence.liked = false;
      });
    } else {
      this.CondoResource.likeOccurrence({'_id': this.condo._id, 'occurrenceId': occurrence._id}).$promise.then(() => {
        occurrence.likes++;
        occurrence.liked = true;
      });
    }
  }

}
