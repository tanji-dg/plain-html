export class CondoResidentsController {

  constructor ($location, $window, $stateParams,
               Session, CondoResource, CondoService, CondoModals) {
    'ngInject';

    this.window = $window;
    this._ = this.window._;
    this.stateParams = $stateParams;
    this.CondoResource = CondoResource;
    this.CondoModals = CondoModals;
    this.Session = Session;

    this.user = this.Session.get();

    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.CondoResource.getUsersFromCondo({'condoId': this.condo._id, '$populate' : '_residences'}).$promise.then((users) => {
        this.users = users;
        let i = 0;
        for (let user of this.users.entries()) {
          let condosRequested = user[1].condosRequested.findIndex((x) => x = user[1]._id);
          if (condosRequested != -1)
          {
            this.users[i].condoProfile = "Requisitante da Residência";
          }

          let condos = user[1].condos.findIndex((x) => x = user[1]._id);
          if (condos != -1)
          {
            this.users[i].condoProfile = "Morador";
          }

          let condosAdmin = user[1].condosAdmin.findIndex((x) => x = user[1]._id);
          if (condosAdmin != -1)
          {
            this.users[i].condoProfile = "Admin";
          }

          let condoOwner = user[1].condosOwner.findIndex((x) => x = user[1]._id);
          if (condoOwner != -1)
          {
            this.users[i].condoProfile = "Super Admin";
          }

          i = i + 1;

          for (let res of user[1].residences.voterResidences.entries()) {
            res[1].residenceProfile = "Proprietário(direito à voto)";
          }

          for (let res of user[1].residences.requesterResidences.entries()) {
            res[1].residenceProfile = "Requisitante";
          }

          for (let res of user[1].residences.userResidences.entries()) {
            res[1].residenceProfile = "Residente";
          }

          user[1].residences.allResidences =
            user[1].residences.voterResidences
              .concat(user[1].residences.requesterResidences
                .concat(user[1].residences.userResidences));
        }
      });
    });
  }

  addUser() {
    this.CondoModals.addCondoUser(this.condo);
    /*this.CondoModals.addCondoUser().then((user) => {

    });*/
  }

  updateUser(user, residence) {
    this.CondoModals.updateCondoUser(user, residence, this.condo);
  }

  removeUser(user, residence) {
    this.CondoModals.deleteCondoUser(user, residence, this.condo);
  }
}
