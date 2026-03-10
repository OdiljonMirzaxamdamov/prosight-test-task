import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Prosight Test Task API is running',
      docs: '/docs',
    };
  }
}
