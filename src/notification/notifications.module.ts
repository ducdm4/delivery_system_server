import { NotificationProviders } from 'src/typeorm/providers/notification.providers';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [...NotificationProviders, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
