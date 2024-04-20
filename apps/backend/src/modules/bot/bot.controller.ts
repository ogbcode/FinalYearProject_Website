import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Version, UsePipes, Headers } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Bot } from './entities/bot.entity';

@Controller('bot')
@ApiTags('Bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Version('1')
  @Post("create")
  @ApiOperation({ summary: 'Create a new Bot' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Bot successfully created', type: Bot })
  async create(@Body() createBotDto: CreateBotDto): Promise<any> {
    try {
      return await this.botService.create(createBotDto);
    } catch (error) {
      // console.log(error.message)
      throw new Error(`Failed to create bot: ${error.message}`);
      
    }
  }

  @Version('1')
  @Get("user/:id")
  @ApiOperation({ summary: 'Get all bots for a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all bots for a user', type: [Bot] })
  async findAll(@Param("id") id: string): Promise<Bot[]> {
    try {
      return await this.botService.findAll(id);
    } catch (error) {
      throw new Error(`Failed to fetch bots: ${error.message}`);
    }
  }
  @Version('1')
  @Get("/user/count/:id")
  @ApiOperation({ summary: 'Number of bots a user has' })
  @ApiResponse({ status: HttpStatus.OK, description: 'No of bots a user  has' })
  async botCount(@Param("id") id: string): Promise<any> {
    try {
      return await this.botService.botCount(id);
    } catch (error) {
      throw new Error(`Failed to fetch bots: ${error.message}`);
    }
  }

@Version('1')
@Get("data/:id")
@ApiOperation({ summary: 'Send the bot the relevant data it needs to start' })
@ApiResponse({ status: HttpStatus.OK, description: 'Send the bot its data',  })

async sendData(@Param("id") id: string,@Headers('Authorization') token: string): Promise<Object> {
  try {
    return await this.botService.sendData(id,token);
  } catch (error) {
    throw new Error(`Failed to fetch bot: ${error.message}`);
  }
}
  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get a bot by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bot found by ID', type: Bot })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bot not found' })
  async findOne(@Param('id') id: string): Promise<Bot> {
    try {
      return await this.botService.findOne(id);
    } catch (error) {
      throw new Error(`Failed to find bot: ${error.message}`);
    }
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a bot by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bot successfully updated', type: Bot })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bot not found' })
  async update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto): Promise<Bot> {
    try {
      return await this.botService.update(id, updateBotDto);
    } catch (error) {
      throw new Error(`Failed to update bot: ${error.message}`);
    }
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bot by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bot successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bot not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      return await this.botService.remove(id);
      }
     catch (error) {
      throw new Error(`Failed to delete bot: ${error.message}`);
    }
  }
}
