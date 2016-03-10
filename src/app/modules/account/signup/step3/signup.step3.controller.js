export class AccountSignupStep3Controller {

  constructor(Session, $location, HouseResource, houseResidentResource, HouseModals) {
    'ngInject';
    
    this.swal = $window.swal;
    this.location = $location;


    this.account = Session.get();
    this.houses = HouseResource.query();
    this.myHouses = HouseResource.query({'userId' : this.account.userId});

    this.HouseModals = HouseModals;
    this.houseResidentResource = houseResidentResource;
  }
  
  addHouseResident(house) {
	    let houseResident = new this.houseResidentResource({
	      'id' : {
	        'houseId' : house.id,
	        'houseResidentId'  : this.account.houseResidentId
	      }
	    });

	    houseResident.$save().then(() => {
	      this.myHouses.unshift(house);
	      this.swal('Adicionado com Sucesso!', `Morador adcionado a unidade: ${house.name}`, 'success');
	    });
	  }
  
  removeHouseResident(house, index) {
	    let houseResident = new this.houseResidentResource({
	      'houseId' : house.id,
	      'houseResidentId'  : this.account.houseResidentId
	    });

	    houseResident.$remove().then(() => {
	      this.myHouses.splice(index, 1);
	    });
	  }
  
  createHouseResident() {
	      this.HouseModals.create().then((condo) => {
	      this.myHouses.unshift(condo);
	      this.swal('Adicionado com Sucesso!', `Morador adcionado a unidade: ${house.name}`, 'success');
	    });
	  }
  
  save() {
	      this.account.signupStep = 0;
	      this.account.$save().then(() => {
	      this.location.path('/signup/0');
	    });
	  }
  
}
