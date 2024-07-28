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

      // if (!result.changeDetected) {
      if (result.changeDetected) {
        this.logger.log(
          `Change detected. Sending notification email for: ${url}`,
        );
        const to = process.env.NOTIFICATION_EMAIL;
        const subject = 'Nouveaux concerts !';
        const text = `Cette salle de concert vient d'updater sa programmation: ${url}`;
        const html = `<p>Ladies and Gentlemen,</p><p>J'ai l'immense plaisir de vous annoncer que cette salle de concert vient d'updater sa programmation: </p><p><strong><a href="${url}">${url}</strong></a></p><p>Merci et à bientôt ! ;)</p><p>Julien</p>`;
        await this.emailService.sendEmail(to, subject, text, html);
      } else {
        this.logger.log(
          `No change detected for: ${url}. Skipping email notification.`,
        );
      }

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
