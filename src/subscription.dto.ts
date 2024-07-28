import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({
    description: 'Token for push notification subscription',
    example: 'user-ui-generated-token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
