export class GateController {

  constructor ($location, $window, $stateParams,
               Session, CondoResource, CondoService, CondoModals) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;
    this.stateParams = $stateParams;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.Session = Session;
    this.gateEntries = [];
    this.loadGateOccurrences();
  }

  unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

  loadGateOccurrences () {
    this.gateEntries = [];

    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
    });

    this.CondoResource.getOccurrences({'_id': this.stateParams.condoId}).$promise.then((occurrences) => {
      this.occurrences = occurrences.filter(o => o.type == 'GATE');
      this.residencesIds = [];
      for (let occurrence of this.occurrences.entries()) {
        this.residencesIds = this.residencesIds.concat(occurrence[1].viewers.residences);
      }

      this.residencesIds = this.residencesIds.filter(function(e) {return e});
      this.residencesIds = this.unique(this.residencesIds);
      
      this.CondoResource.getResidences({'_id': this.stateParams.condoId}).$promise.then((residences) => {
        this.residences = residences.filter(r => this.residencesIds.indexOf(r._id) != -1);
        this.gateEntries = [];
        for (let residence of this.residences.entries()) {
          residence[1].anchor = true;
          this.gateEntries.push(residence[1]);

          for (let occurrence of this.occurrences.entries()) {
            if (occurrence[1].viewers.residences.indexOf(residence[1]._id) != -1) {
              occurrence[1].anchor = false;
              this.gateEntries.push(occurrence[1]);
            }
          }
        }
      });
    });
  }

  /* Occurrence REST */

  addCondoOccurrence () {
    this.CondoModals.addCondoOccurrence(null, this.condo, this);
  }

  addCondoOccurrence (it) {
    this.CondoModals.addCondoOccurrence(it, this.condo, this);
  }

  updateCondoOccurrence (occurrence) {
    this.CondoModals.updateCondoOccurrence(occurrence, this.condo, this);
  }

  removeOccurrenceFromCondo (occurrence) {
    this.CondoModals.removeOccurrenceFromCondo(occurrence, this.condo, this);
  }
}
