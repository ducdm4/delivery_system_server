import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from 'src/notification/notifications.service';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Cron('0 0 9 * * *')
  async noticeEmployeeCreateManifest() {
    const userHasTokenList = await this.userService.getListEmployeeHasToken();
    if (userHasTokenList.length > 0) {
      userHasTokenList.forEach((user) => {
        this.notificationService.sendPushNotificationForEmployee(
          user.notificationToken,
          {
            title: `Hi ${user.firstName} ${user.lastName}`,
            body: `A new day has come, please create a new manifest!`,
          },
        );
      });
    }
  }
}
