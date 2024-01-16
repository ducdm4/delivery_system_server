import { Module } from '@nestjs/common';
import { TasksService } from './scheduleTasks.service';
import { NotificationsService } from '../notification/notifications.service';
import { UsersService } from '../user/users.service';
import { MailService } from '../mail/mail.service';
import { EmployeesService } from '../employee/employees.service';
import { NotificationProviders } from '../typeorm/providers/notification.providers';
import { UserProviders } from '../typeorm/providers/user.providers';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...NotificationProviders,
    ...UserProviders,
    ...EmployeeProviders,
    MailService,
    TasksService,
    NotificationsService,
    UsersService,
    EmployeesService,
  ],
  exports: [TasksService],
})
export class TasksModule {}
