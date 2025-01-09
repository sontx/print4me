import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as os from 'os';
import * as path from 'path';

const databasePath =
  process.env.NODE_ENV === 'production'
    ? path.join(os.homedir(), 'print4me.sqlite') // Place in home directory for production
    : 'database.sqlite'; // Place in project directory for development

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: databasePath,
      entities: [User],
      synchronize: true, // Automatically create database schema (only for development)
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
