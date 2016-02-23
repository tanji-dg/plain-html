import { routerConfig } from './index.router';
import { CondoAttachmentResource } from './index.resource';

export default angular.module('econdos.modules.condoAttachment', [])
  .config(routerConfig)
  .service('CondoAttachmentResource', CondoAttachmentResource)
