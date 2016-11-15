export class CreateOccurrenceController {

  constructor($window, $uibModalInstance,
              CondoResource, UserResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.Session = Session;
    this.UserResource = UserResource;
    this.CondoResource = CondoResource;
    this.modalInstance = $uibModalInstance;
    
    this.residence = DataSource.residence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;

    this.residencesSelection = false;
    this.allResidencesIds = [];

    this.CondoResource.getResidencesFromCondo({'_id' : this.condo._id}).$promise.then(
      residences => {
        this.residences = residences;
      }
    );

    if (typeof this.residence !== 'undefined') {
      this.chooseResidence(this.residence);
    }
  }

  addOccurrence() {
    if (typeof this.title === 'undefined' || typeof this.description === 'undefined' || this.allResidencesIds.length == 0) {
      this.swal("Dados Inválidos", "Preencha todos os campos!", "error");
      return;
    }

    this.swal({
      title: "Tem certeza que deseja criar a ocorrência?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.addOccurrenceToCondo({'_idCondo': this.condo._id, 'title': this.title, 'description': this.description, 'type': 'GATE', 'viewers.residences': this.allResidencesIds}).$promise.then(() => {
          this.swal("Ocorrência Criada", "A ocorrência foi criada com sucesso!", "success");
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
