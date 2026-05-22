import { Controller, Post, Body, Get } from '@nestjs/common';
import { MelodifyService } from './melodify.service';

@Controller('melodify')
export class MelodifyController {
  constructor(private readonly melodifyService: MelodifyService) {}

  @Get('sync')
  async sync(@Body() tracks: any[]) {
    return this.melodifyService.syncSongsToMelodify();
  }
}