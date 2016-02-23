import { routerConfig } from './index.router';
import { OccurrenceFavorVoteResource } from './index.resource';

export default angular.module('econdos.modules.occurrenceFavorVote', [])
  .config(routerConfig)
  .service('OccurrenceFavorVoteResource', OccurrenceFavorVoteResource)

