import { routerConfig } from './index.router';
import { PersistenceAuditEventResource } from './index.resource';

export default angular.module('econdos.modules.persistenceAuditEvent', [])
  .config(routerConfig)
  .service('PersistenceAuditEventResource', PersistenceAuditEventResource)

