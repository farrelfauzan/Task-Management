import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth';
import { comparePassword } from 'src/utils/bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { SessionData } from 'express-session';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private dataSource: DataSource,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Login method
  async login(
    user: LoginAuthDto,
    req: Request,
    session: SessionData,
  ): Promise<any> {
    try {
      const { email, password } = user;
      const userFound = await this.validateUser(email, password);
      console.log(userFound);
      if (userFound) {
        console.log('User found');
        session.user = userFound;
        console.log(session);
        return {
          user: userFound,
          bearerToken: this.jwtService.sign(
            {
              id: userFound.id,
              email: userFound.email,
              username: userFound.username,
              firstName: userFound.firstName,
              lastName: userFound.lastName,
              isActive: userFound.isActive,
            },
            {
              secret: this.configService.get('JWT_SECRET'),
              expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
            },
          ),
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Validate user method
  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (user) {
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
          return user;
        } else {
          throw new Error('Invalid password');
        }
      }
      return undefined; // Return undefined if user not found
    } catch (error) {
      this.logger.error(error);
      return undefined; // Return undefined in case of error
    }
  }

  async register(user: CreateUserDto): Promise<User | any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = await this.userService.create(user);
      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new HttpException(error.response, HttpStatus.BAD_REQUEST);
    }
  }
}
