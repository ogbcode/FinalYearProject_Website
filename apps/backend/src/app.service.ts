import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHellov1(): Promise<string> {
    return 'Hello World, Thifffffs is version 1!';
  }

  async getHellov2(): Promise<string> {
    return 'Hello World,s version 2!';
  }
}
