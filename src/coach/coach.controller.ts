import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { LoginCoachDto } from './dto/login-coach.dto';
import {VerifyOtpDto} from './dto/verify-otp.dto'

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Post('login')
  @HttpCode(200) 
  login(@Body() loginCoachDto: LoginCoachDto) {
    return this.coachService.login(loginCoachDto);
  }

  @Post('verify')
  @HttpCode(200)
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.coachService.verifyOtp(verifyOtpDto);
  }

  @Get()
  findAll() {
    return this.coachService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req) {
    console.log(req.user)
    return this.coachService.getCoachProfile(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.update(+id, updateCoachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}
