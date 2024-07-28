import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async addSubscriber(token: string) {
    const { data, error } = await this.client
      .from('subscribers')
      .insert([{ token }]);

    if (error) {
      console.error('Error adding subscriber:', error);
      throw error;
    }

    return data;
  }

  async getSubscribers() {
    const { data, error } = await this.client
      .from('subscribers')
      .select('token');

    if (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }

    return { data, error };
  }
}
