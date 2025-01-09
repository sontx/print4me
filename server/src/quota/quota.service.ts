import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
const ms = require('ms');

@Injectable()
export class QuotaService {
  constructor(private userService: UserService) {}

  /**
   * Check if the used quota is less than the allowed quota in a duration which count from the startPeriodDate to now.
   * If the duration between the startPeriodDate and now is less than or equal to a duration, the used quota should be less than the allowed quota.
   * Otherwise, set the new startPeriodDate to now and reset the used quota to 0.
   */
  private analyzeDurationQuota(
    usedQuota: number,
    allowedQuota: number,
    startPeriodDate: Date | number | string,
    checkDuration = '30d',
    step = 1,
  ): {
    newStartPeriodDate: Date;
    newUsedQuota: number;
    hasQuota: boolean;
  } {
    const now = new Date();
    const start = new Date(startPeriodDate);
    const duration = now.getTime() - start.getTime();
    if (duration > ms(checkDuration)) {
      return {
        newStartPeriodDate: now,
        newUsedQuota: step,
        hasQuota: true,
      };
    }

    return {
      newStartPeriodDate: start,
      newUsedQuota: usedQuota + step,
      hasQuota: usedQuota < allowedQuota,
    };
  }

  async checkRequestQuota(
    quotaKey: string,
    user: any,
    allowedQuota: number,
    doJob: (config) => Promise<any>,
    step = 1,
  ) {
    const userDetails = await this.userService.getUser(
      user.email,
      user.product,
    );
    if (!userDetails) {
      throw new UnauthorizedException();
    }

    const config = userDetails.config;
    const { usedQuota = 0, startPeriodDate = 0 } =
      config[quotaKey] ?? {};
      
    const analyzeResult = this.analyzeDurationQuota(
      usedQuota,
      allowedQuota,
      startPeriodDate,
      '30d',
      step,
    );

    if (!analyzeResult.hasQuota) {
      throw new HttpException('Quota exceeded', 429);
    }

    const newConfig = {
      ...config,
      [quotaKey]: {
        usedQuota: analyzeResult.newUsedQuota,
        startPeriodDate: analyzeResult.newStartPeriodDate,
      },
    };

    const result = await doJob(newConfig);
    await this.userService.updateConfig(user.product, user.email, newConfig);
    return result;
  }
}
