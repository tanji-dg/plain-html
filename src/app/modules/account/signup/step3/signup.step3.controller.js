export class AccountSignupStep3Controller {

  constructor ($location, $window, $q, $cookies, 
							Session, CondoResource) {
		'ngInject';

		this.swal = $window.swal;
		this.location = $location;
		this.cookies = $cookies;
		this.CondoResource = CondoResource;

		this.account = Session.get();

		this.setUpCondo();
	}

	setUpCondo () {
		this.condo = this.cookies.getObject('condo');
		if (this.condo._id && _.isUndefined(this.condo.name)) {
			this.condoResource = this.CondoResource.get({'_id': this.condo._id});
			this.condoResource.$promise.then((condo) => {
				this.condo = condo;
				this.cookies.putObject('condo', this.condo);
				this.setUpResidence();
			});
		} else {
			this.setUpResidence();
		}
	}

	setUpResidence () {
		this.condoUser = this.CondoResource.addUser({'_id': this.condo._id, 'userId' : this.account._id});
		let residences = this.condoUser.$promise.then(() =>
	    this.CondoResource.getResidences({
	      '_id': this.condo._id
	    }).$promise
		);
	}
}
