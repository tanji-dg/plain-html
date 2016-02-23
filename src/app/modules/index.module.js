import AccountModule from './account/index.module';
import CondoModule from './condo/index.module';
import CondoUserModule from './condoUser/index.module';
import HomeModule from './home/index.module';
import NotificationModule from './notification/index.module';
import UserModule from './user/index.module';
import CondoEntityModule from './CondoEntity/index.module';
import CondoAttachmentModule from './CondoAttachment/index.module';

export default angular.module('econdos.modules', [
  AccountModule.name,
  CondoModule.name,
  CondoUserModule.name,
  HomeModule.name,
  NotificationModule.name,
  UserModule.name,
  CondoEntityModule.name,
  CondoAttachmentModule.name
]);
