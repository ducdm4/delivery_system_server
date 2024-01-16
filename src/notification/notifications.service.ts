import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/typeorm/entities/notification.entity';
import { Repository } from 'typeorm';
import * as firebaseAdmin from 'firebase-admin';
import { BasicOrderInfo } from 'src/order/dto/order.dto';
import { ORDER_STATUS } from 'src/common/constant';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    '/Users/duongminhduc/work/learn/delivery-system-ccad9-firebase-adminsdk-xdr0n-a59267a396.json',
  ),
});

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async sendPushNotificationForOrder(
    token: string,
    notification: { title: string; body: string },
  ) {
    await firebaseAdmin
      .messaging()
      .send({
        notification,
        token,
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  async sendPushNotificationForEmployee(
    token: string,
    notification: { title: string; body: string },
  ) {
    await firebaseAdmin
      .messaging()
      .send({
        notification,
        token,
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
