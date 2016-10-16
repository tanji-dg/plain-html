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
    this.loadAllCollections();
    this.activeUsers();
  }

  loadAllCollections()
  {
    this.CondoResource.get({'_id': this.stateParams.condoId}).$promise.then((condo) => {
      this.condo = condo;
      this.CondoResource.getUsers({ '_id' : this.condo._id }).$promise.then((users) => {
        this.usersFromCondo = users;
        this.condoId = this.stateParams.condoId;
        let i = 0;
        for (let user of this.usersFromCondo.entries()) {
          let condosRequested = user[1].condosRequester.indexOf(this.condo._id);
          if (condosRequested !== -1)
          {
            this.usersFromCondo[i].condoProfile = "Requisitante da Residência";
          }

          let condos = user[1].condos.indexOf(this.condo._id);
          if (condos !== -1)
          {
            this.usersFromCondo[i].condoProfile = "Morador";
          }

          let condosAdmin = user[1].condosAdmin.indexOf(this.condo._id);
          if (condosAdmin !== -1)
          {
            this.usersFromCondo[i].condoProfile = "Admin";
          }

          let condoOwner = user[1].condosOwner.indexOf(this.condo._id);
          if (condoOwner !== -1)
          {
            this.usersFromCondo[i].condoProfile = "Síndico";
          }
          i = i + 1;

          if (this.user._id === user[1]._id) {
            this.isCondoAdmin =
              (user[1].condosAdmin.indexOf(this.condo._id) !== -1);
            this.isCondoOwner =
              (user[1].condosOwner.indexOf(this.condo._id) !== -1);
          }
        }

        this.CondoResource.getResidences({ '_id' : this.condo._id }).$promise.then((residences) => {
          this.residencesFromCondo = residences;
          this.residencesSetup = [];

          for (let residence of this.residencesFromCondo.entries()) {
            // residence list
            this.residencesSetup.push({'residence' : residence[1], 'user' : 'none', 'profile': 'none'});
            // residence voter

            if (typeof residence[1].voter !== 'undefined' && residence[1].voter !== null) {
              let voterUser = this.getCondoUser(this.usersFromCondo, residence[1].voter);
              if (voterUser !== null && voterUser !== 'none') {
                this.residencesSetup.push({'residence' : residence[1], 'user' : voterUser, 'profile': 'Proprietário(direito à voto)'});
              }
            }
            // residence users
            for (let user of residence[1].users.entries()) {
              let residenceUser = this.getCondoUser(this.usersFromCondo, user[1]);
              if (user[1] !== null && residenceUser !== 'none') {
                this.residencesSetup.push({'residence' : residence[1], 'user' : residenceUser, 'profile': 'Residente'});
              }
            }
            // residence requesters
            for (let requester of residence[1].requesters.entries()) {
              let requesterUser = this.getCondoUser(this.usersFromCondo, requester[1]);
              if (requester[1] !== null && requesterUser !== 'none') {
                this.residencesSetup.push({'residence' : residence[1], 'user' : requesterUser, 'profile': 'Requisitante'});
              }
            }
          }
        });
      });
    });
  }

  getCondoUser(users, id) {
    for (let user of users.entries()) {
      if (user[1]._id === id) {
        return user[1];
      }
    }

    return 'none';
  }

  showCondoProfileActionButtons(userEntry) {
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

  showResidenceProfileActionButtons(item) {
    if (this.isCondoOwner || this.isCondoAdmin) {
      return true;
    }

    return false;
  }

  activeUsers() {
    this.isResidencesActive = false;
    this.isUsersActive = true;
  }

  activeResidences() {
    this.isUsersActive = false;
    this.isResidencesActive = true;
  }

  /* Residence */

  addCondoResidence() {
    this.CondoModals.addCondoResidence(null, this.condo, this);
  }

  addCondoResidence(it) {
    this.CondoModals.addCondoResidence(it, this.condo, this);
  }

  updateCondoResidence(item) {
    this.CondoModals.updateCondoResidence(item, this.condo, this);
  }

  removeResidenceFromCondo(item) {
    this.CondoModals.removeResidenceFromCondo(item, this.condo, this);
  }

  /* User Condo */

  addCondoUserProfile() {
    this.CondoModals.addCondoUserProfile(this.condo, this);
  }

  updateCondoUserProfile(user) {
    this.loggedUser = this.Session.get();
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);

    if (this.isCondoOwner && this.loggedUser._id === user._id) {
      this.swal("Aviso", "É necessário nomear um novo síndico.", "warning");
    } else {
      this.CondoModals.updateCondoUserProfile(user, this.condo, this);
    }
  }

  removeUserFromCondo(user) {
    this.loggedUser = this.Session.get();
    this.isCondoOwner = this.Session.isCondoOwner(this.condo._id);

    if (this.isCondoOwner && this.loggedUser._id === user._id) {
      this.swal("Aviso", "É necessário nomear um novo síndico.", "warning");
    } else {
      this.CondoModals.removeUserFromCondo(user, this.condo, this);
    }
  }
}
