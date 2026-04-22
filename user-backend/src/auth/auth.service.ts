import { PrismaService } from './../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createuser-dto';
import bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/enums';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user-dto';
import { create } from 'node:domain';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: { sub: string; role?: Role; jti?: string };

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET_KEY',
        ),
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token has expired, please log in again',
        );
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
      },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException(
        'Refresh token reuse detected, all sessions revoked',
      );
    }

    const isValid = await bcrypt.compare(token, storedToken.hashedToken);

    if (!isValid) {
      await this.prisma.refreshToken.deleteMany({
        where: { userId: payload.sub },
      });

      throw new UnauthorizedException('Refresh token reuse detected');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const newTokenPayload = {
      sub: storedToken.user.userId,
      role: storedToken.user.role,
    };

    const newAccessToken = this.jwtService.sign(newTokenPayload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.jwtService.sign(
      {
        sub: storedToken.user.userId,
        role: storedToken.user.role,
      },
      {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET_KEY',
        ),
        expiresIn: '7d',
      },
    );

    const newHash = await bcrypt.hash(newRefreshToken, 10);

    await this.prisma.$transaction([
      this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId: storedToken.user.userId,
          hashedToken: newHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logIn(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });

    const DUMMY_HASH =
      '$2b$12$invalidhashfortimingprotectionXXXXXXXXXXXXXXXXXXXXXX';
    const hashToCompare = existing?.password ?? DUMMY_HASH;
    const valid = await bcrypt.compare(loginUserDto.password, hashToCompare);

    if (!existing || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = { sub: existing.userId, role: existing.role };

    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn: '10s',
    });

    const refreshToken = this.jwtService.sign(
      { sub: existing.userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: '7d',
      },
    );

    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        userId: existing.userId,
        firstName: existing.firstname,
        lastName: existing.lastname,
        email: existing.email,
        phone: existing.phone,
        role: existing.role,
      },

      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase().trim();

    // Use a generic message to prevent email enumeration
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Registration failed'); // intentionally vague
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const { newUser, refreshToken } = await this.prisma.$transaction(
      async (tx) => {
        const newUser = await tx.user.create({
          data: {
            firstname: createUserDto.firstName,
            lastname: createUserDto.lastName,
            email,
            phone: createUserDto.phone,
            location: createUserDto.location,
            password: passwordHash,
            role: Role.User, // ← never trust client-supplied role
          },
        });

        const refreshToken = this.jwtService.sign(
          { sub: newUser.userId },
          {
            secret: this.configService.getOrThrow(
              'JWT_REFRESH_TOKEN_SECRET_KEY',
            ),
            expiresIn: '7d',
          },
        );

        const hashedToken = await bcrypt.hash(refreshToken, 10);

        const refreshTokenRecord = await tx.refreshToken.create({
          data: {
            userId: newUser.userId,
            hashedToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        return {
          newUser,
          refreshToken,
        };
      },
    );

    // Sign minimal access token — no PII
    const accessToken = this.jwtService.sign(
      { sub: newUser.userId, role: newUser.role },
      { expiresIn: '15m' },
    );

    return {
      user: {
        userId: newUser.userId,
        firstName: newUser.firstname,
        lastName: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },

      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
