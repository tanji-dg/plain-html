describe('AccountLoginController', () => {
  let controller;

  beforeEach(angular.mock.module('econdos'));

  beforeEach(inject(($injector) => {
    controller = () => {
      return $injector.get('$controller')('AccountLoginController');
    };
  }));

  it('should have been initialized', () => {
    let vm = controller();
    expect(vm).toBeDefined();
  });
});
