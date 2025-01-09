import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { MazeController } from './maze.controller';
import { MazeService } from './maze.service';

@Module({
  imports: [UserModule],
  controllers: [MazeController],
  providers: [MazeService]
})
export class MazeModule {}
