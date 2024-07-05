import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUsersDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req) {
    const user = await this.userService.findOne(req.user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      city: user.city,
      phone: user.phone,
      cep: user.cep,
      dateOfBirth: user.dateOfBirth,
    };
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Request() req, @Body() updateUserDto: UpdateUsersDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
