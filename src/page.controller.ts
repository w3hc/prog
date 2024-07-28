// src/page.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './page.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Add')
@Controller('add')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @ApiOperation({ summary: 'Fetch and store webpage content' })
  async createPage(@Body() createPageDto: CreatePageDto) {
    const { url } = createPageDto;
    return this.pageService.addPage(url);
  }
}
