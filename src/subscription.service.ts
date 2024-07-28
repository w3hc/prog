import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async subscribe(token: string) {
    console.log('Subscribing token:', token);
    return this.supabaseService.addSubscriber(token);
  }

  async getAllTokens(): Promise<string[]> {
    const { data, error } = await this.supabaseService.getSubscribers();

    if (error) {
      console.error('Error fetching subscribers:', error);
      throw new Error('Error fetching subscribers');
    }

    return data.map((subscriber) => subscriber.token);
  }
}
