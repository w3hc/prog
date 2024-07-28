// src/page.dto.ts
import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({
    description: 'URL of the page to fetch and store',
    example: 'https://www.domainedo.fr/spectacles/tous-les-spectacles',
  })
  @IsUrl()
  url: string;
}
