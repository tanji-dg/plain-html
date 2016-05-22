export class AccountSignupStep3Controller {

  constructor ($location, $window,
							Session, CondoResource, CondoService, CondoModals) {
		'ngInject';

		this.swal = $window.swal;
		this.location = $location;
		this.CondoResource = CondoResource;
    this.CondoService = CondoService;
    this.CondoModals = CondoModals;

		this.user = Session.get();

		this.setUpCondo();
	}

	setUpCondo () {
		this.condo = this.CondoService.get();
		if (this.condo._id && _.isUndefined(this.condo.name)) {
			this.CondoResource.get({'_id': this.condo._id}).$promise.then((condo) => {
				this.condo = condo;
				this.CondoService.set(this.condo);
				this.setUpResidence();
			});
		} else {
			this.setUpResidence();
		}
	}

	setUpResidence () {
		this.CondoResource.addUser({'_id': this.condo._id, 'userId': this.user._id}).$promise.then(() =>
			this.CondoResource.getResidences({'_id': this.condo._id, '$populate': 'users requesters'}).$promise
		).then((residences) => {
      if(residences.length === 0) {
        this.CondoResource.addResidence({'_id': this.condo._id}, {'identification': 0}).$promise.then((residence) => {
          this.residence = this.CondoResource.getResidence({
            '_id' : this.condo._id,
            'residenceId' : residence._id,
            '$populate' : 'users requesters'
          });
        });
      } else {
        this.residence = residences[0];
      }
    });
	}

  addUser () {
    this.CondoModals.createUser().then((user) => {
      this.CondoResource.addUserToResidence({'_id': this.condo._id, 'residenceId': this.residence._id, userId: user._id}).$promise.then(() => {
        if(!_.some(this.residence.residents, {'_id': user._id})) this.residence.residents.push(user)
      })
    });
  }

  removeUser (user) {
    let userIndex = _.findIndex(this.residence.residents, {'_id': user._id});
    this.residence.residents.splice(userIndex, 1);
  }

  save () {
    return this.CondoResource.updateResidence({'_id': this.condo._id, 'residenceId' : this.residence._id}, {'identification': this.residence.identification}).$promise.then(() => {
      this.user.signupStep = 0;
      _.clone(this.user).$update().then(() => {
        this.location.path('/feed');
      });
    })
  }
}
