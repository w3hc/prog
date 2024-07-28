// src/page.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable()
export class PageService {
  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async addPage(url: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const content = response.data;

      const page = { url, content };
      const result = await this.supabaseService.addPage(page);
      return result;
    } catch (error) {
      console.error('Error fetching the webpage:', error);
      throw new HttpException(
        'Invalid URL or network error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
