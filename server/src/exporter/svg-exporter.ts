import { AbstractExporter, ExportedData, isSvg } from './exporter';

export class SvgExporter extends AbstractExporter {
  protected async exportEach(data: any): Promise<ExportedData> {
    if (isSvg(data)) {
      return {
        buffer: Buffer.from(data),
        mimeType: 'image/svg+xml',
      };
    }

    throw new Error('Unsupported data type for SVG export');
  }
}
