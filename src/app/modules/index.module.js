import AccountModule from './account/index.module';
import CondoModule from './condo/index.module';
import HomeModule from './home/index.module';
import FeedModule from './feed/index.module';
import FileModule from './file/index.module';
import UserModule from './user/index.module';
import AuthorityModule from './authority/index.module';
import CommentModule from './comment/index.module';
import ResidenceModule from './residence/index.module';
import OccurrenceModule from './occurrence/index.module';

export default angular.module('econdos.modules', [
  AccountModule.name,
  CondoModule.name,
  HomeModule.name,
  FeedModule.name,
  FileModule.name,
  UserModule.name,
  AuthorityModule.name,
  CommentModule.name,
  ResidenceModule.name,
  OccurrenceModule.name
]);
