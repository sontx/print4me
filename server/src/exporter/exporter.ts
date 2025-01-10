import { Canvas } from 'canvas';
import { Buffer } from 'buffer';
import { zipItems } from '../utils/zip-utils';

export interface ExportedData {
  buffer: Buffer;
  mimeType: string;
  metadata?: any;
}

export interface Exporter {
  export(data: any, config?: any): Promise<ExportedData>;
}

export abstract class AbstractExporter implements Exporter {
  async export(data: any, config?: any): Promise<ExportedData> {
    if (Array.isArray(data)) {
      const resultItems: ExportedData[] = [];
      for (const item of data) {
        const resultItem = await this.export(item);
        resultItems.push(resultItem);
      }

      const mimeToExt: { [key: string]: string } = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'application/pdf': 'pdf',
        'image/svg+xml': 'svg',
        'text/plain': 'txt',
      };
      const zipBuffer = await zipItems(
        resultItems.map((item, index) => {
          const fileNames = config?.fileNames;
          return {
            name:
              fileNames?.[index] ??
              `file-${index + 1}.${mimeToExt[item.mimeType] ?? 'jpg'}`,
            buffer: item.buffer,
          };
        }),
      );
      return {
        buffer: zipBuffer,
        mimeType: 'application/zip',
      };
    }

    return this.exportEach(data, config);
  }

  protected abstract exportEach(data: any, config?: any): Promise<ExportedData>;
}

export const isSvg = (item: any) =>
  typeof item === 'string' && item.includes('<svg');
export const isCanvas = (item: any) => item instanceof Canvas;
