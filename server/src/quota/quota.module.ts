import { Global, Module } from '@nestjs/common';
import { QuotaService } from './quota.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule, UserModule],
  providers: [QuotaService],
  exports: [QuotaService]
})
export class QuotaModule {}
