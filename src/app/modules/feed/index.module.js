import { routerConfig } from './index.router';
import { FeedResource } from './index.resource';

import { FeedController } from './index.controller';

export default angular.module('econdos.modules.feed', [])
  .config(routerConfig)
  .service('FeedResource', FeedResource)
  .controller('FeedController', FeedController)

