import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    findUserByEmail(email: string) {
        const user = this.userRepository.findOneBy({ email });
        return user;
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        user.created_at = new Date();
        user.updated_at = new Date();
        const hashedPassword = await bcrypt.hash(userData.password ? userData.password : "123456", 10);
        user.password = hashedPassword;
        return this.userRepository.save(user);
    }

    async validateUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        if (!user) {
            return null;
        }

        const status = bcrypt.compareSync(password, user.password);
        if (status) {
            return user;
        }
        return null;
    }

    async saveRefreshToken(refreshToken: string, userId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User not found with ${userId}`);
        }
        const hasRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refresh_token = hasRefreshToken;
        return this.userRepository.save(user);
    }

    async verifyRefreshToken(refreshToken: string, userId: number) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user && user.refresh_token) {
            const status = bcrypt.compareSync(refreshToken, user.refresh_token);
            if (status) {
                return user;
            }
        }
        return false;
    }
}
