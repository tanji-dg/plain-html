import AccountModule from './account/index.module';
import CondoModule from './condo/index.module';
import CondoUserModule from './condoUser/index.module';
import HomeModule from './home/index.module';
import NotificationModule from './notification/index.module';
import UserModule from './user/index.module';
import CondoEntityModule from './condoEntity/index.module';
import CondoAttachmentModule from './CondoAttachment/index.module';
import AuthorityModule from './authority/index.module';
import CommentModule from './comment/index.module';
import CommentLikerModule from './commentLiker/index.module';
import CondoAdminModule from './condoAdmin/index.module';
import CustomAuditEventModule from './customAuditEvent/index.module';
import CustomJpaModule from './customJpa/index.module';
import HouseModule from './customJpa/index.module';
import HouseResidentModule from './houseResident/index.module';
import OccurrenceModule from './occurrence/index.module';
import OccurrenceAgainstVoteModule from './occurrenceAgainstVote/index.module';
import OccurrenceFavorVoteModule from './occurrenceFavorVote/index.module';
import OccurrenceLikerModule from './occurrenceLiker/index.module';
import PersistenceAuditEventModule from './persistenceAuditEvent/index.module';


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
