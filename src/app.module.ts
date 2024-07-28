// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupabaseService } from './supabase.service';
import { SubscriptionService } from './subscription.service';
import { NotificationService } from './notification.service';
import { PageService } from './page.service';
import { SubscriptionController } from './subscription.controller';
import { NotificationController } from './notification.controller';
import { PageController } from './page.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [HttpModule],
  controllers: [SubscriptionController, NotificationController, PageController],
  providers: [
    SupabaseService,
    SubscriptionService,
    NotificationService,
    PageService,
    FirebaseService, // Add FirebaseService here
  ],
})
export class AppModule {}
