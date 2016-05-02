export class AccountSignupStep3Controller {

constructor(Session, $location, $window, CondoResource, HouseResidentModals) {
	'ngInject';

	this.swal = $window.swal;
	this.location = $location;

	this.account = Session.get();
	// this.houses = HouseResource.query();
  this.myCondos = CondoResource.query({'userId' : this.account.userId});

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
	this.account.signupStep = 0;
	this.account.$save().then(() => {
		this.location.path('/signup/0');
	});
}

}
