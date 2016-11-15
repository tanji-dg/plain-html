export class UpdateOccurrenceController {

  constructor($window, $uibModalInstance,
              CondoResource, UserResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.CondoResource = CondoResource;
    this.UserResource = UserResource;
    this.Session = Session;
    this.modalInstance = $uibModalInstance;

    this.occurrence = DataSource.occurrence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.residencesSelection = false;
    this.allResidencesIds = [];

    this.CondoResource.getResidencesFromCondo({'_id' : this.condo._id}).$promise.then(
      residences => {
        this.residences = residences;
        for (let res of this.occurrence.viewers.residences.entries()) {
          let residence = this.residences.filter(r => r._id == res[1]);
          this.chooseResidence(residence[0]);
        }
      }
    );
  }

  updateOccurrence() {
    if (typeof this.occurrence.title === 'undefined' ||
        typeof this.occurrence.description === 'undefined' ||
        this.allResidencesIds.length == 0 ||
        this.occurrence.title.length == 0 ||
        this.occurrence.description.length == 0) {
      this.swal("Dados Inválidos", "Preencha todos os campos!", "error");
      return;
    }

    this.swal({
      title: "Tem certeza que deseja continuar com a atualização?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.updateOccurrence({
          '_idCondo': this.condo._id, 
          'occurrenceId': this.occurrence._id, 
          '_id': this.occurrence._id, 
          'title': this.occurrence.title, 
          'description': this.occurrence.description, 
          'type': 'GATE', 
          'viewers': {
            'residences': this.allResidencesIds
          }
        }).$promise.then(() => {
          this.swal("Ocorrência Atualizada", "A ocorrência foi atualizada com sucesso!", "success");
          this.refWindow.loadGateOccurrences();
          this.close();
        });
      }
    });
  }

  toggleResidencesSelection() {
    return this.residencesSelection = !this.residencesSelection;
  }

  chooseAllResidences() {
    for (let residence of this.residences.entries()) {
      this.chooseResidence(residence[1]);  
    }
  }

  clearAllResidences() {
    this.allResidencesIds = [];
    this.filterResidenceTerm = undefined;
  }

  chooseResidence (residence) {
    if (this.allResidencesIds.indexOf(residence._id) == -1) {
      this.allResidencesIds.push(residence._id);
      this.allResidencesIds = this.allResidencesIds.filter(function(e) {return e});
      if (this.allResidencesIds.length != 0) {
        if (typeof this.filterResidenceTerm === 'undefined') {
          this.filterResidenceTerm = residence.identification;
        } else {
          this.filterResidenceTerm = this.filterResidenceTerm + ", " + residence.identification;
        }
      } else {
        this.filterResidenceTerm = residence.identification;
      }
    } else {
      this.swal("Aviso", "Residência(s) já selecionada(s).", "warning");
    }
  }

  close () {
    this.modalInstance.dismiss();
  }
}
