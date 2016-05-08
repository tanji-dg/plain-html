export class AccountSignupStep3Controller {

constructor(Session, $q, $location, $window, $rootScope, 
						CondoResource, HouseResource, UserResource, HouseResidentModals) {
	'ngInject';

	this.swal = $window.swal;
	this.location = $location;
	this.rootScope = $rootScope;
	this.condo = this.rootScope.condo;

	this.account = Session.get();
	this.house = HouseResource.query({'condoId': this.condo.id});
	// this.house.$promise.then((house) => {
	// 	this.house = _.last(house);
	// 	if(!this.house) {
	// 		this.house = new HouseResource({'condoId': this.condo.id, 'voterId': this.account.userId, 'number': 0});
	// 		this.house.$save().then(() => {
	// 			alert();
	// 		});
	// 	}
	// });

  this.HouseResidentModals = HouseResidentModals;
  // this.HouseResidentResource = HouseResidentResource;
}
  
// addHouseResident(house) {
// 	let houseResident = new this.HouseResidentResource({
// 	'id' : {
// 			'houseId' : house.id,
// 			'houseResidentId'  : this.account.houseResidentId
// 			}
// 	});

// 	houseResident.$save().then(() => {
// 		this.myHouses.unshift(house);
// 		this.swal('Adicionado com Sucesso!', `Morador adcionado a unidade: ${house.name}`, 'success');
// 	});
// }
  
// removeHouseResident(house, index) {
// 	let houseResident = new this.HouseResidentResource({
// 			'houseId' : house.id,
// 			'houseResidentId'  : this.account.houseResidentId
// 	});
	
// 	houseResident.$remove().then(() => {
// 		this.myHouses.splice(index, 1);
// 	});
// }
  
createHouseResident() {
	this.HouseResidentModals.create().then((house) => {
		this.myHouses.unshift(house);
		this.swal('Adicionado com Sucesso!', `Morador adcionado a unidade: ${house.numero}`, 'success');
	});
}
  
save() {
	// if(!this.house.id) this.house = new HouseResource();
	// $q.all([

	// ]).then(() => {

	// });
	// this.account.signupStep = 0;
	// this.account.$save().then(() => {
	// 	this.location.path('/signup/0');
	// });
}

}
