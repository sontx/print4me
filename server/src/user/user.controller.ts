import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginSchema, registerSchema } from './user.dto';
import { JoiValidationPipe } from '../auth/joi-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { ConfigService } from '../config/config.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body(new JoiValidationPipe(registerSchema)) body: any) {
    const { product, email, password, fullName, country } = body;
    try {
      await this.userService.addUser({
        product,
        email,
        password,
        fullName,
        country,
      });
    } catch (e) {
      console.log(`Error registering user: ${e}`);
      throw new UnauthorizedException('User already exists');
    }
    return await this.userService.login(email, password, product);
  }

  @Post('login')
  async login(@Body(new JoiValidationPipe(loginSchema)) body: any) {
    const { product, email, password } = body;
    return await this.userService.login(email, password, product);
  }

  @Get('current')
  @UseGuards(AuthGuard) // Protect this route with the AuthGuard
  async getCurrentUser(@Req() request: any) {
    const { email, product } = request.user;
    const user = await this.userService.getUser(email, product);
    return {
      ...user,
      quota: {
        downloadQuota: this.configService.downloadQuotaPerMonth,
      },
    };
  }
}
