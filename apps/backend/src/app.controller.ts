import { Controller, Get, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Hello')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Get Hello for v1' })
  @ApiResponse({ status: 200, description: 'Hello response for v1' })
  async getHellov1(@Res() res: any, @Req() req: any) {
    const text = await this.appService.getHellov1();
    return res.status(200).send({ message: text });
  }

  @Version('2')
  @Get()
  @ApiOperation({ summary: 'Get Hello for v2' })
  @ApiResponse({ status: 200, description: 'Hello response for v2' })
  async getHellov2(@Res() res: any, @Req() req: any) {
    const text = await this.appService.getHellov2();
    return res.status(200).send({ message: text });
  }
}
