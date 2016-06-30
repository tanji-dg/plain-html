import { ConfigBlock } from './index.config';
import { RunBlock } from './index.run';

import Modules from './modules/index.module';
import Core from './core/index.module';

angular
  .module('econdos', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'ngResource',
    'ngFileUpload',
    'ngTagsInput',
    'toastr',
    'validation.match',
    'LocalStorageModule',
    'ui.utils.masks',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'angularPromiseButtons',
    'angularMoment',
    'cloudinary',

    Core.name,
    Modules.name
  ])
  .config(ConfigBlock)
  .run(RunBlock)
;
