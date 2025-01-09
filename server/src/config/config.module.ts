import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['prod', 'production'].includes(process.env.NODE_ENV)
        ? '.env.prod'
        : '.env.dev',
      isGlobal: true, // Make the ConfigModule globally available
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService], // Export ConfigService so it can be used in other modules
})
export class ConfigModule {}
