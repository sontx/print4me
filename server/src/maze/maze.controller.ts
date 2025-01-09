import { Products } from './../auth/products.decorator';
import { FORMAT_TO_DRAW_TYPE, FORMAT_TO_EXPORTER } from './../exporter/index';
import { AuthGuard } from './../auth/auth.guard';
import { JoiValidationPipe } from './../auth/joi-validation.pipe';
import { QuotaService } from './../quota/quota.service';
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import {
  BuildMazeConfigSchema,
  DownloadOptionsSchema,
  generateMaze,
} from './maze-generator';
import { Canvas } from 'canvas';
import { retry } from '../utils/http-utils';
import { ConfigService } from '../config/config.service';
import { User } from '../auth/user.decorator';
import { ProductGuard } from '../auth/product.guard';

@Products(['print4me-maze'])
@UseGuards(AuthGuard, ProductGuard)
@Controller('maze')
export class MazeController {
  constructor(
    private configService: ConfigService,
    private quotaService: QuotaService,
  ) {}

  @Post('generate')
  async generateMaze(
    @Body(new JoiValidationPipe(BuildMazeConfigSchema)) body: any,
    @Res() res: Response,
    @User() user: any,
  ) {
    return this.quotaService.checkRequestQuota(
      'generateQuota',
      user,
      this.configService.generateQuotaPerMonth,
      async () => {
        return await retry(
          async () => {
            const canvas = await generateMaze({
              ...body,
              watermarked: true,
              drawType: 'canvas',
            });

            res.setHeader('Content-Type', 'image/jpeg');
            const buffer = (canvas as Canvas).toBuffer('image/jpeg', {
              quality: 0.4,
              chromaSubsampling: true,
            });
            res.send(buffer);
          },
          3,
          0,
          2000,
        );
      },
    );
  }

  @Post('download')
  async downloadMaze(
    @Body(new JoiValidationPipe(DownloadOptionsSchema)) body: any,
    @Res() res: Response,
    @User() user: any,
  ) {
    return this.quotaService.checkRequestQuota(
      'downloadQuota',
      user,
      this.configService.downloadQuotaPerMonth,
      async (newConfig) => {
        const seed = body.randomSeed || Date.now();
        const drawType = FORMAT_TO_DRAW_TYPE[body.format];

        let dataToExtract = await generateMaze({
          ...body,
          solve: body.format !== 'pdf' && body.solve,
          randomSeed: seed,
          drawType,
        });

        if (body.format === 'pdf' && body.solve) {
          dataToExtract = [dataToExtract];
          const svg = await generateMaze({
            ...body,
            solve: true,
            randomSeed: seed,
            drawType,
          });
          dataToExtract.push(svg);
        }

        const width = body.columnCount * body.cellWidth;
        const height = body.rowCount * body.cellWidth;
        const { buffer, mimeType, metadata } = await FORMAT_TO_EXPORTER[
          body.format
        ].export(dataToExtract, {
          ...body.pdf,
          width,
          height,
        });

        res.setHeader('Content-Type', mimeType);
        res.setHeader('x-is-scaled', metadata?.isScaled ?? false);
        res.setHeader(
          'x-available-quota',
          Math.max(
            this.configService.downloadQuotaPerMonth -
              newConfig.downloadQuota.usedQuota,
            0,
          ),
        );
        res.send(buffer);
      },
    );
  }
}
