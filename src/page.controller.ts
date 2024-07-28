// src/page.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './page.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pages')
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiOperation({ summary: 'Fetch and store webpage content' })
  @ApiResponse({ status: 201, description: 'Page stored successfully' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async createPage(@Body() createPageDto: CreatePageDto) {
    const { url } = createPageDto;
    return this.pageService.addPage(url);
  }
}
