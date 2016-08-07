/**
 * CONSTANTS
 */
import { config } from './constants/config.constant';

/**
 * DIRECTIVES
 */
import { scrollToItem } from './directives/scrollToItem.directive';
import { lightgallery } from './directives/lightgallery.directive';

/**
 * FACTORIES
 */
import { $mock } from './factories/mock.factory';

/**
 * INTERCEPTORS
 */
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

/**
 * SERVICES
 */
import { AuthService } from './services/auth.service';
import { Base64Service } from './services/base64.service';
import { SessionService } from './services/session.service';

export default angular.module('joinesty.core', [])
  .constant('config', config)
  .directive('scrollToItem', scrollToItem)
  .directive('lightgallery', lightgallery)
  .factory('$mock', $mock)
  .service('AuthInterceptor', AuthInterceptor)
  .service('ErrorInterceptor', ErrorInterceptor)
  .service('Auth', AuthService)
  .service('Base64', Base64Service)
  .service('Session', SessionService)
