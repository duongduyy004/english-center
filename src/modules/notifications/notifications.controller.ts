import { Controller, Post, Body } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { SendNotificationDto } from './dto/send-notification.dto'
import { Public } from 'decorator/customize.decorator'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) { }

  @Public()
  @Post('send')
  async send(@Body() dto: SendNotificationDto) {
    /**
     * Normally:
     * - expoPushToken → lấy từ DB theo userId
     * - isOnline → lấy từ Redis / socket map
     */

    const fakeUserState = {
      isOnline: false,
      expoPushToken: 'ExponentPushToken[WjzrsjMvEmgM_CWDbWNe9s]',
    }

    return this.service.send(dto, fakeUserState)
  }
}
