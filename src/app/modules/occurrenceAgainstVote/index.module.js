import { routerConfig } from './index.router';
import { OccurrenceAgainstVoteResource } from './index.resource';

export default angular.module('econdos.modules.occurrenceAgainstVote', [])
  .config(routerConfig)
  .service('OccurrenceAgainstVoteResource', OccurrenceAgainstVoteResource)

