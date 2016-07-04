import { routerConfig } from './index.router';
import { FileResource } from './index.resource';

export default angular.module('econdos.modules.file', [])
  .config(routerConfig)
  .service('FileResource', FileResource)

