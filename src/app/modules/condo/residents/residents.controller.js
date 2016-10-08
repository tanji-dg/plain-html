export class CondoResidentsController {

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
    this.user = this.Session.get();
    this.load();
    this.loadAllCollections();
  }

  loadAllCollections()
  {
    this.CondoResource.getUsers({ '_id' : this.stateParams.condoId }).$promise.then((users) => {
      this.usersFromCondo = users;
      this.condoId = this.stateParams.condoId;
      let i = 0;
      for (let user of this.usersFromCondo.entries()) {
        let condosRequested = user[1].condosRequested.indexOf(this.condoId);
        if (condosRequested !== -1)
        {
          this.usersFromCondo[i].condoProfile = "Requisitante da Residência";
        }

        let condos = user[1].condos.indexOf(this.condoId);
        if (condos !== -1)
        {
          this.usersFromCondo[i].condoProfile = "Morador";
        }

        let condosAdmin = user[1].condosAdmin.indexOf(this.condoId);
        if (condosAdmin !== -1)
        {
          this.usersFromCondo[i].condoProfile = "Admin";
        }

        let condoOwner = user[1].condosOwner.indexOf(this.condoId);
        if (condoOwner !== -1)
        {
          this.usersFromCondo[i].condoProfile = "Síndico";
        }
        i = i + 1;
      }
    });

    this.CondoResource.getResidences({ '_id' : this.stateParams.condoId }).$promise.then((residences) => {
      this.residencesFromCondo = residences;
    });
  }

  showActionButtons(userEntry) {
    if (userEntry._id === this.user._id) {
      return false;
    }

    if (this.isCondoOwner) {
      return true;
    }

    if (this.isCondoAdmin) {
      if (userEntry.condoProfile !== "Síndico") {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  addUser() {
    this.CondoModals.addCondoUser(this.condo, this);
  }

  updateUser(user, residence) {
    this.CondoModals.updateCondoUser(user, residence, this.condo, this);
  }

  removeUser(user, residence) {
    this.CondoModals.deleteCondoUser(user, residence, this.condo, this);
  }

  addCondoUserProfile() {
    this.CondoModals.addCondoUserProfile(this.condo, this);
  }

  updateCondoUserProfile(user) {
    this.loggedUser = this.Session.get();
    this.isCondoOwner = this.Session.isCondoOwner(this.condo);

    if (this.isCondoOwner && this.loggedUser._id === user._id) {
      this.swal("Aviso", "É necessário nomear um novo síndico.", "warning");
    } else {
      this.CondoModals.updateCondoUserProfile(user, this.condo, this);
    }
  }

  removeUserFromCondo(user) {
    this.loggedUser = this.Session.get();
    this.isCondoOwner = this.Session.isCondoOwner(this.condo);

    if (this.isCondoOwner && this.loggedUser._id === user._id) {
      this.swal("Aviso", "É necessário nomear um novo síndico.", "warning");
    } else {
      this.CondoModals.removeUserFromCondo(user, this.condo, this);
    }
  }

  isResidenceValid(residence) {
    for(let res of this.residences.entries()) {
      if (res[1]._id === residence._id) {
        this.striped = this.striped + 1;
        return true;
      }
    }

    return false;
  }

  load() {
    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.residences = this.CondoResource.getResidencesFromCondo({'_id' : this.condo._id});
      this.CondoResource.getUsersFromCondo({'_id' : this.condo._id, '$populate' : '_residences'}).$promise.then((users) => {
        this.users = users;
        let i = 0;
        for (let user of this.users.entries()) {
          let condosRequested = user[1].condosRequested.indexOf(this.condo._id);
          if (condosRequested !== -1)
          {
            this.users[i].condoProfile = "Requisitante da Residência";
          }

          let condos = user[1].condos.indexOf(this.condo._id);
          if (condos !== -1)
          {
            this.users[i].condoProfile = "Morador";
          }

          let condosAdmin = user[1].condosAdmin.indexOf(this.condo._id);
          if (condosAdmin !== -1)
          {
            this.users[i].condoProfile = "Admin";
          }

          let condoOwner = user[1].condosOwner.indexOf(this.condo._id);
          if (condoOwner !== -1)
          {
            this.users[i].condoProfile = "Síndico";
          }

          i = i + 1;

          for (let res of user[1].residences.voterResidences.entries()) {
            res[1].residenceProfile = "Proprietário(direito à voto)";
          }

          for (let res of user[1].residences.userResidences.entries()) {
            res[1].residenceProfile = "Residente";
          }

          for (let res of user[1].residences.requesterResidences.entries()) {
            res[1].residenceProfile = "Requisitante";
          }

          user[1].residences.voterResidences.forEach(function (item, index, array) {
              let idx = user[1].residences.userResidences.findIndex((x) => x._id = item._id);
              if (idx !== 1) {
                user[1].residences.userResidences.splice(idx, 1);
              }

              idx = user[1].residences.requesterResidences.findIndex((x) => x._id = item._id);
              if (idx !== 1) {
                user[1].residences.requesterResidences.splice(idx, 1);
              }
          });

          user[1].residences.userResidences.forEach(function (item, index, array) {
              let idx = user[1].residences.requesterResidences.findIndex((x) => x._id = item._id);
              if (idx !== 1) {
                user[1].residences.requesterResidences.splice(idx, 1);
              }
          });

          user[1].residences.allResidences =
            user[1].residences.voterResidences
              .concat(user[1].residences.userResidences
                .concat(user[1].residences.requesterResidences));

          if (this.user._id === user[1]._id) {
            this.isCondoAdmin =
              (user[1].condosAdmin.indexOf(this.condo._id) !== -1);
            this.isCondoOwner =
              (user[1].condosOwner.indexOf(this.condo._id) !== -1);
          }
        }
      });
    });
  }
}
