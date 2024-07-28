// src/page.service.ts
import { Injectable } from '@nestjs/common';
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
    const response = await firstValueFrom(this.httpService.get(url));
    const content = response.data;

    const page = { url, content };
    return this.supabaseService.addPage(page);
  }
}
