import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
        });
        this.usersService.saveRefreshToken(refreshToken, user.id);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
        };
    }

    async verifyRefreshToken(refreshToken: string) {
        const decode = this.jwtService.decode(refreshToken);
        if (decode) {
            const user = this.usersService.verifyRefreshToken(refreshToken, decode.sub);
            if (user) {
                return user;
            }
        }
        return false;
    }
}
