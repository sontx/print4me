import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { MazeModule } from './maze/maze.module';
import { QuotaModule } from './quota/quota.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ConfigModule,
    AuthModule,
    MazeModule,
    QuotaModule,
  ],
})
export class AppModule {}
