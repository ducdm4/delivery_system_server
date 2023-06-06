import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { UserProviders } from '../typeorm/providers/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [...UserProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
