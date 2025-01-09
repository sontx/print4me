import { PdfExporter } from './pdf-exporter';
import { PngExporter } from './png-exporter';
import { SvgExporter } from './svg-exporter';

export * from './exporter';
export * from './pdf-exporter';
export * from './png-exporter';
export * from './svg-exporter';

export const FORMAT_TO_DRAW_TYPE = {
  svg: 'svg',
  png: 'canvas',
  pdf: 'svg',
};

export const FORMAT_TO_EXPORTER = {
  svg: new SvgExporter(),
  png: new PngExporter(),
  pdf: new PdfExporter(),
};
