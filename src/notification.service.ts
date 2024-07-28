import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async sendNotification(title: string, body: string) {
    this.logger.debug(
      `Attempting to send notification with title: ${title} and body: ${body}`,
    );

    const tokens = await this.subscriptionService.getAllTokens();
    if (tokens.length === 0) {
      this.logger.warn('No subscribers found to send notifications to');
      throw new Error('No subscribers to send notifications to');
    }

    this.logger.debug(
      `Found ${tokens.length} subscribers. Sending notifications...`,
    );

    this.logger.debug(`title: ${title}, body: ${body}, tokens: ${tokens}`);

    try {
      const response = await this.firebaseService.sendNotification(tokens, {
        title,
        body,
      });
      this.logger.log('Notification sent successfully', response);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification', error.stack);
      throw error;
    }
  }
}
