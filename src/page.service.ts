// src/page.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { EmailService } from './email.service';

@Injectable()
export class PageService {
  private readonly logger = new Logger(PageService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly supabaseService: SupabaseService,
    private readonly emailService: EmailService,
  ) {}

  async addPage(url: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const content = response.data;

      const page = { url, content };
      const result = await this.supabaseService.addPage(page);

      this.logger.log(`Sending notification email for: ${url}`);
      const to = process.env.NOTIFICATION_EMAIL;
      const subject = 'New Page Added';
      const text = `A new page has been added: ${url}`;
      const html = `<h1>New Page Added</h1><p>A new page has been added: <a href="${url}">${url}</a></p>`;
      await this.emailService.sendEmail(to, subject, text, html);

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
