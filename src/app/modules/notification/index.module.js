import { routerConfig } from './index.router';
import { NotificationResource } from './index.resource';

export default angular.module('econdos.modules.notification', [])
  .config(routerConfig)
  .service('NotificationResource', NotificationResource)

