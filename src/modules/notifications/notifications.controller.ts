import { Controller, Post, Body, Get, Query, Patch, Param, NotFoundException } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { SendNotificationDto } from './dto/send-notification.dto'
import { Public, UserInfo } from 'decorator/customize.decorator'
import { User } from 'modules/users/user.domain'
import { QueryDto } from 'utils/types/query.dto'
import { FilterNotificationDto, SortNotificationDto } from './dto/query-notification.dto'
import { Notification } from './notification.domain'
import { NotificationGateway } from './notification.gateway'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationGateway: NotificationGateway
  ) { }

  @Public()
  @Post('send')
  async send(@Body() dto: SendNotificationDto) {
    /**
     * Check user online status from socket map
     * If any recipient is online, use WebSocket
     * Otherwise, use Expo Push Notification
     */

    // Check if at least one recipient is online
    const isAnyRecipientOnline = dto.recipientIds.some(userId =>
      this.notificationGateway.isUserOnline(userId)
    )

    const userState = {
      isOnline: isAnyRecipientOnline,
      expoPushToken: 'ExponentPushToken[WjzrsjMvEmgM_CWDbWNe9s]',
    }

    // return this.notificationsService.send(dto, userState)
  }

  @Get()
  findAll(
    @Query() query: QueryDto<FilterNotificationDto, SortNotificationDto>,
    @UserInfo() user: User,
  ) {
    const page = query?.page;
    const limit = query?.limit;

    // Tự động filter theo userId của người dùng hiện tại
    const filters = {
      ...query.filters,
      recipientId: user.id,
    };

    return this.notificationsService.findAll({
      filterOptions: filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Patch('mark-as-read/:notificationId')
  async markAsRead(
    @Param('id') id: Notification['id'],
    @UserInfo() user: User,
  ) {
    const notification = await this.notificationsService.markAsRead(id, user.id);

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return notification;
  }
}
