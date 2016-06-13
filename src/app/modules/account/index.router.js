export let routerConfig = ($stateProvider) => {
  'ngInject';

  $stateProvider.state('accountLogin', {
    'url'         : '/login',
    'templateUrl' : 'app/modules/account/login/login.view.html'
  });

  $stateProvider.state('accountSignupStep0', {
    'url'         : '/signup',
    'templateUrl' : 'app/modules/account/signup/step0/signup.step0.view.html'
  });

  $stateProvider.state('accountSignupStep1', {
    'url'         : '/signup/1',
    'templateUrl' : 'app/modules/account/signup/step1/signup.step1.view.html'
  });

  $stateProvider.state('accountSignupStep2', {
    'url'         : '/signup/2',
    'templateUrl' : 'app/modules/account/signup/step2/signup.step2.view.html'
  });

  $stateProvider.state('accountActivate', {
    'url'         : '/activate?key',
    'templateUrl' : 'app/modules/account/activate/activate.view.html'
  });

};
