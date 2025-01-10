import { AbstractExporter, ExportedData, isCanvas } from './exporter';

export class PngExporter extends AbstractExporter {
  protected async exportEach(data: any): Promise<ExportedData> {
    if (isCanvas(data)) {
      return {
        buffer: data.toBuffer('image/png'),
        mimeType: 'image/png',
      };
    }

    throw new Error('Unsupported data type for PNG export');
  }
}
