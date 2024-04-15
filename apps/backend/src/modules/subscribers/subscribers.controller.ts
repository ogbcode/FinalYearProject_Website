import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Subscriber } from './entities/subscriber.entity';

@Controller('subscribers')
@ApiTags('Subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Version('1')
  @Post('create')
  @ApiOperation({ summary: 'Create a new subscriber' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subscriber successfully created' })
  async create(@Body() createSubscriberDto: CreateSubscriberDto) {
    try {
      const subscriber = await this.subscribersService.create(createSubscriberDto);
      return subscriber;
    } catch (error) {
      throw new Error(`Failed to create subscriber: ${error.message}`);
    }
  }

  @Version('1')
  @Get("/bot/:id")
  @ApiOperation({ summary: 'Get all subscribers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all subscribers',
    type: Subscriber,
    isArray: true,
  })
  async findAll(@Param('id') id: string) {
    try {
      const subscribers = await this.subscribersService.findAll(id);
      return subscribers;
    } catch (error) {
      throw new Error(`Failed to fetch subscribers: ${error.message}`);
    }
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Get a subscriber by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriber found by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscriber not found' })
  async findOne(@Param('id') id: string) {
    try {
      const subscriber = await this.subscribersService.findOne(id);
      return subscriber;
    } catch (error) {
      throw new Error(`Failed to find subscriber: ${error.message}`);
    }
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscriber by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriber successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscriber not found' })
  async update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    try {
      const updatedSubscriber = await this.subscribersService.update(id, updateSubscriberDto);
      return updatedSubscriber;
    } catch (error) {
      throw new Error(`Failed to update subscriber: ${error.message}`);
    }
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscriber by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriber successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscriber not found' })
  @HttpCode(HttpStatus.OK) // Explicitly setting HTTP status code to 200
  async remove(@Param('id') id: string) {
    try {
      return await this.subscribersService.remove(id);
    } catch (error) {
      throw new Error(`Failed to delete subscriber: ${error.message}`);
    }
  }
}
