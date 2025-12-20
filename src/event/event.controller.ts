import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':eventId')
  async getEventById(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.getEventById(eventId);
  }

  @Get('with-league')
  async getEventsWithLeagueNames() {
    return this.eventService.getEventsWithLeagueNames();
  }
}
