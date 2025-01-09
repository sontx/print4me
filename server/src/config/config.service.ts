import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get jwtSecret(): string {
    return (
      this.nestConfigService.get<string>('JWT_SECRET') ||
      'I met a Minecraft Girlfriend - RL Minecraft - 1'
    );
  }

  get saltRounds(): number {
    return parseInt(this.nestConfigService.get('SALT_ROUNDS') ?? '10', 10);
  }

  get expiresIn(): string {
    return this.nestConfigService.get<string>('EXPIRES_IN') || '4h';
  }

  get generateQuotaPerMonth() {
    return parseInt(this.nestConfigService.get('GENERATE_QUOTA_PER_MONTH'), 10);
  }

  get downloadQuotaPerMonth() {
    return parseInt(this.nestConfigService.get('DOWNLOAD_QUOTA_PER_MONTH'), 10);
  }

  get allowedOrigin(): string {
    return this.nestConfigService.get<string>('ALLOWED_ORIGINS');
  }
}
