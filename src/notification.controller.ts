import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Send notification to all subscribers' })
  @ApiResponse({ status: 200, description: 'Notification sent' })
  async sendNotification(
    @Body('title') title: 'string',
    @Body('body') body: 'string',
  ) {
    return this.notificationService.sendNotification(title, body);
  }
}
