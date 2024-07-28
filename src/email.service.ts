// src/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

@Injectable()
export class EmailService {
  private mg: any;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.logger.log(
      `Initializing EmailService with domain: ${process.env.MAILGUN_DOMAIN}`,
    );
    this.logger.log(
      `API Key (first 4 chars): ${process.env.MAILGUN_API_KEY?.substring(0, 4)}****`,
    );

    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      this.logger.error(
        'Mailgun API key or domain is missing in environment variables',
      );
      throw new Error('Mailgun configuration is incomplete');
    }

    try {
      const mailgun = new Mailgun(formData);
      this.mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
        url: 'https://api.eu.mailgun.net',
      });

      this.logger.log('Mailgun client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Mailgun client', error.stack);
      throw error;
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<any> {
    this.logger.log(`Attempting to send email to: ${to}`);
    this.logger.log(`Using domain: ${process.env.MAILGUN_DOMAIN}`);

    const data = {
      from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject,
      text,
      html,
    };

    this.logger.log(`Email data: ${JSON.stringify(data, null, 2)}`);

    try {
      const result = await this.mg.messages.create(
        process.env.MAILGUN_DOMAIN,
        data,
      );
      this.logger.log(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error in sendEmail method: ${error.message}`,
        error.stack,
      );
      this.logger.error(`Full error object: ${JSON.stringify(error, null, 2)}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
