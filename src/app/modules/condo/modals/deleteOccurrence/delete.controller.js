export class DeleteOccurrenceController {

  constructor($window, $uibModalInstance,
              CondoResource, Session, DataSource) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.swal = this.window.swal;

    this.CondoResource = CondoResource;
    this.Session = Session;
    this.modalInstance = $uibModalInstance;

    this.occurrence = DataSource.occurrence;
    this.condo = DataSource.condo;
    this.refWindow = DataSource.refWindow;
  }

  removeFromCondo() {
    this.swal({
      title: "Tem certeza que deseja excluir está ocorrência?",
      text: "Esta ação não poderá ser desfeita.",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim",
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {
        this.CondoResource.removeOccurrence({'_id' : this.condo._id, 'occurrenceId': this.occurrence._id}).$promise.then(() => {
          this.swal("Ocorrência Removida", "O ocorrência foi removida do condomínio com sucesso!", "success");
          this.refWindow.loadGateOccurrences();
          this.close();
        });
      }
    });
  }

  close() {
    this.modalInstance.dismiss();
  }
}
