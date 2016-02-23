import AccountModule from './account/index.module';
import CondoModule from './condo/index.module';
import CondoUserModule from './condoUser/index.module';
import HomeModule from './home/index.module';
import NotificationModule from './notification/index.module';
import UserModule from './user/index.module';
import CondoEntityModule from './CondoEntity/index.module';
import CondoAttachmentModule from './CondoAttachment/index.module';
import AuthorityModule from './AuthorityModule/index.module';
import CommmentModule from './CommmentModule/index.module';
import CommentLikerModule from './CommentLikerModule/index.module';
import CondoAdminModule from './CondoAdminModule/index.module';
import CustomAuditEventModule from './CustomAuditEventModule/index.module';
import CustomJpaModule from './CustomJpaModule/index.module';
import HouseModule from './CustomJpaModule/index.module';
import HouseResidentModule from './HouseResidentModule/index.module';
import OccurrenceModule from './OccurrenceModule/index.module';
import OccurrenceAgainstVoteModule from './OccurrenceAgainstVoteModule/index.module';
import OccurrenceFavorVoteModule from './OccurrenceFavorVoteModule/index.module';
import OccurrenceLikerModule from './OccurrenceLikerModule/index.module';
import PersistenceAuditEventModule from './PersistenceAuditEventModule/index.module';


export default angular.module('econdos.modules', [
  AccountModule.name,
  CondoModule.name,
  CondoUserModule.name,
  HomeModule.name,
  NotificationModule.name,
  UserModule.name,
  CondoEntityModule.name,
  CondoAttachmentModule.name,
  AuthorityModule.name,
  CommentModule.name,
  CommentLikerModule.name,
  CondoAdminModule.name,
  CustomAuditEventModule.name,
  CustomJpaModule.name,
  HouseModule.name,
  HouseResidentModule.name,
  OccurrenceModule.name,
  OccurrenceAgainstVoteModule.name,
  OccurrenceFavorVoteModule.name,
  OccurrenceLikerModule.name,
  PersistenceAuditEventModule.name
]);
