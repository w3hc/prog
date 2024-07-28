// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupabaseService } from './supabase.service';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { NotificationService } from './notification.service';
import { FirebaseService } from './firebase.service';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { NotificationController } from './notification.controller';
import { EmailService } from './email.service';

@Module({
  imports: [HttpModule],
  controllers: [PageController, SubscriptionController, NotificationController],
  providers: [
    SupabaseService,
    PageService,
    NotificationService,
    FirebaseService,
    SubscriptionService,
    EmailService,
  ],
})
export class AppModule {}
