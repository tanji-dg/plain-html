import AccountModule from './account/index.module';
import HomeModule from './home/index.module';
import UserModule from './user/index.module';

export default angular.module('econdos.modules', [
  AccountModule.name,
  HomeModule.name,
  UserModule.name
]);
