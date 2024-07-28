import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SupabaseService } from './supabase.service';
import { FirebaseService } from './firebase.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [SubscriptionController, NotificationController],
  providers: [
    SubscriptionService,
    SupabaseService,
    FirebaseService,
    NotificationService,
  ],
})
export class AppModule {}
