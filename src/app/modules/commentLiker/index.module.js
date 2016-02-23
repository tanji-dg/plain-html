import { routerConfig } from './index.router';
import { CommentLikerResource } from './index.resource';

export default angular.module('econdos.modules.commentLiker', [])
  .config(routerConfig)
  .service('CommentLikerResource', CommentLikerResource)

