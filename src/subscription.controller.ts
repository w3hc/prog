import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './subscription.dto';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Subscribe to push notifications' })
  @ApiResponse({ status: 201, description: 'Subscribed successfully' })
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    console.log('Received token in controller:', subscribeDto.token); // Add debug log
    return this.subscriptionService.subscribe(subscribeDto.token);
  }
}
