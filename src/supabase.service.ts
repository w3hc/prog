// src/supabase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';
import { diffWords } from 'diff';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

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
      this.logger.error('Error adding subscriber:', error.message);
      throw error;
    }

    return data;
  }

  async getSubscribers() {
    const { data, error } = await this.client
      .from('subscribers')
      .select('token');

    if (error) {
      this.logger.error('Error fetching subscribers:', error.message);
      throw error;
    }

    return { data, error };
  }

  normalizeContent(content: string): string {
    const dom = new JSDOM(content);
    const body = dom.window.document.body;

    // Remove scripts, styles, and comments
    const scripts = body.getElementsByTagName('script');
    const styles = body.getElementsByTagName('style');
    while (scripts.length > 0) scripts[0].remove();
    while (styles.length > 0) styles[0].remove();

    // Remove comments
    const removeComments = (node: Node) => {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i];
        if (child.nodeType === 8) {
          // 8 is comment node
          child.remove();
        } else if (child.nodeType === 1) {
          // 1 is element node
          removeComments(child);
        }
      }
    };
    removeComments(body);

    // Normalize whitespace
    return body.textContent.replace(/\s+/g, ' ').trim();
  }

  async addPage(page: { url: string; content: string }) {
    this.logger.log(`Fetching existing page with URL: ${page.url}`);

    const { data: existingPages, error: fetchError } = await this.client
      .from('pages')
      .select('id, content, url')
      .eq('url', page.url);

    if (fetchError) {
      this.logger.error(`Error fetching page: ${fetchError.message}`);
      throw fetchError;
    }

    const normalizedNewContent = this.normalizeContent(page.content);

    if (existingPages.length === 0) {
      this.logger.log(
        `Page with URL ${page.url} not found, inserting new page`,
      );
      const { error } = await this.client
        .from('pages')
        .insert([
          { ...page, content: normalizedNewContent, changeDetected: false },
        ]);

      if (error) {
        this.logger.error(`Error adding page: ${error.message}`);
        throw error;
      }

      this.logger.log(`Successfully added new page with URL: ${page.url}`);
      return {
        url: page.url,
        content: normalizedNewContent,
        changeDetected: false,
      };
    } else {
      this.logger.log(`Page with URL ${page.url} found, comparing content`);
      const existingPage = existingPages[0];
      const normalizedCurrentContent = this.normalizeContent(
        existingPage.content,
      );

      const differences = diffWords(
        normalizedCurrentContent,
        normalizedNewContent,
      );
      const changeDetected = differences.some(
        (part) => part.added || part.removed,
      );

      this.logger.log(`Change detected: ${changeDetected}`);
      if (changeDetected) {
        this.logger.log('Differences:');
        differences.forEach((part) => {
          if (part.added) {
            this.logger.log(`Added: ${part.value}`);
          } else if (part.removed) {
            this.logger.log(`Removed: ${part.value}`);
          }
        });
      }

      const { error: updateError } = await this.client
        .from('pages')
        .update({ content: normalizedNewContent, changeDetected })
        .eq('url', page.url);

      if (updateError) {
        this.logger.error(`Error updating page: ${updateError.message}`);
        throw updateError;
      }

      this.logger.log(`Successfully updated page with URL: ${page.url}`);
      return { url: page.url, content: normalizedNewContent, changeDetected };
    }
  }
}
