describe('CondoModalsDeleteCondoUserController', () => {
  let controller;

  beforeEach(angular.mock.module('econdos'));

  beforeEach(inject(($injector) => {
    controller = () => {
      return $injector.get('$controller')('CondoModalsDeleteCondoUserController', {
        '$scope' : $injector.get('$rootScope').$new()
      });
    };
  }));

  it('should have been initialized', () => {
    let vm = controller();
    expect(vm).toBeDefined();
  });
});