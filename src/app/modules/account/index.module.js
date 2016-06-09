import { routerConfig } from './index.router';
import { AccountResource } from './index.resource';

import { AccountActivateController } from './activate/activate.controller';
import { AccountLoginController } from './login/login.controller';
import { AccountSignupStep0Controller } from './signup/step0/signup.step0.controller';
import { AccountSignupStep1Controller } from './signup/step1/signup.step1.controller';
import { AccountSignupStep2Controller } from './signup/step2/signup.step2.controller';

export default angular.module('econdos.modules.account', [])
  .config(routerConfig)
  .service('AccountResource', AccountResource)
  .controller('AccountActivateController', AccountActivateController)
  .controller('AccountLoginController', AccountLoginController)
  .controller('AccountSignupStep0Controller', AccountSignupStep0Controller)
  .controller('AccountSignupStep1Controller', AccountSignupStep1Controller)
  .controller('AccountSignupStep2Controller', AccountSignupStep2Controller)


