import { routerConfig } from './index.router';
import { FeedResource } from './index.resource';
import { NavbarService } from './navbar/services/navbar.service';

import { FeedController } from './index.controller';
import { FeedNavbarController } from './navbar/navbar.controller';
import { FeedCondosController } from './condos/condos.controller';
import { FeedResidentsController } from './residents/residents.controller';
import { FeedUserController } from './user/user.controller';

export default angular.module('econdos.modules.feed', [])
  .config(routerConfig)
  .service('FeedResource', FeedResource)
  .service('NavbarService', NavbarService)
  .controller('FeedController', FeedController)
  .controller('FeedNavbarController', FeedNavbarController)
  .controller('FeedCondosController', FeedCondosController)
  .controller('FeedUserController', FeedUserController)
  .controller('FeedResidentsController', FeedResidentsController)
