import { routerConfig } from './index.router';
import { CustomAuditEventResource } from './index.resource';

export default angular.module('econdos.modules.customAuditEvent', [])
  .config(routerConfig)
  .service('CustomAuditEventResource', CustomAuditEventResource)

