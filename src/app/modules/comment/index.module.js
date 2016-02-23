import { routerConfig } from './index.router';
import { CommentResource } from './index.resource';

export default angular.module('econdos.modules.comment', [])
  .config(routerConfig)
  .service('CommentResource', CommentResource)

