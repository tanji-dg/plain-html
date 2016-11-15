import { routerConfig } from './index.router';
import { GateController } from './gate.controller';

export default angular.module('econdos.modules.gate', [])
  .config(routerConfig)
  .controller('GateController', GateController)
