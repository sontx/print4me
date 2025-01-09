import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/user.entity';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a valid string');
    }

    const salt = await bcrypt.genSalt(this.configService.saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a valid string');
    }

    if (!hash || typeof hash !== 'string') {
      throw new Error('Hash must be a valid string');
    }

    return bcrypt.compare(password, hash);
  }

  private generateToken(email: string, product: string): string {
    return jwt.sign({ email, product }, this.configService.jwtSecret, {
      expiresIn: this.configService.expiresIn,
    });
  }

  private verifyToken(token: string): any {
    return jwt.verify(token, this.configService.jwtSecret);
  }

  public async addUser({
    product,
    email,
    password,
    fullName,
    country,
    config,
  }: {
    email: string;
    password: string;
    fullName: string;
    country: string;
    product: string;
    config?: any;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email, product },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await this.hashPassword(password);
    const newUser = this.userRepository.create({
      product,
      email,
      fullName,
      country,
      passwordHash,
      config: config ? JSON.stringify(config) : null,
    });

    await this.userRepository.save(newUser);
    return { message: 'User created successfully' };
  }

  public async getUser(email: string, product: string) {
    const user = await this.userRepository.findOne({
      where: { email, product },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      email: user.email,
      fullName: user.fullName,
      country: user.country,
      createdAt: user.createdAt,
      config: user.config ? JSON.parse(user.config) : {},
    };
  }

  public async updateConfig(product: string, email: string, config: any) {
    const user = await this.userRepository.findOne({
      where: { email, product },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.config = JSON.stringify(config);
    await this.userRepository.save(user);
  }

  public async login(email: string, password: string, product: string) {
    const user = await this.userRepository.findOne({
      where: { email, product },
    });

    if (!user || !(await this.verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(email, product);
    return { token };
  }

  public authorize(token: string) {
    try {
      const decoded = this.verifyToken(token);
      return {
        email: decoded.email,
        product: decoded.product,
      };
    } catch (err) {
      return null;
    }
  }
}
