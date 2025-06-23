import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard.';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) { }

  @Post('/register')
  register(@Body() userData: any) {
    return this.usersService.createUser(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Req() request: any) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() request: any) {
    return request.user;
  }

  @Post('refresh-token')
  refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      throw new BadRequestException("Refresh token is required");
    }
    const user = this.authService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new BadRequestException('Invalid refresh token.');
    }
    return this.authService.login(user);
  }
}
