export class FeedController {

  constructor($location, CondoResource, CondoService) {
    'ngInject';

    this.location = $location;
    this.CondoResource = CondoResource;
    this.CondoService = CondoService;

    this.condo = this.CondoService.get();
    this.occurrences = this.CondoResource.getOccurrences({'_id': this.condo._id});

    //this.CondoResource.addOccurrence({'_id': this.condo._id}, {
    //  'title': 'Testando',
    //  'description': 'Testando 123',
    //  'type': 'PRIVATE'
    //});
    //
    //this.CondoResource.addOccurrence({'_id': this.condo._id}, {
    //  'title': 'Testando',
    //  'description': 'Testando 123',
    //  'type': 'VOTING'
    //});
    //
    //this.CondoResource.addOccurrence({'_id': this.condo._id}, {
    //  'title': 'Testando',
    //  'description': 'Testando 123',
    //  'type': 'ADVICE'
    //});


  }

}
