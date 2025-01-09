import { Logger } from '@nestjs/common';
import { ExportedData, Exporter, isCanvas, isSvg } from './exporter';
import * as PDFDocument from 'pdfkit';
import * as SVGtoPDF from 'svg-to-pdfkit';

const MARGIN = 10;

export class PdfExporter implements Exporter {
  private calculateScaleAndPosition(
    itemWidth: number,
    itemHeight: number,
    pageWidth: number,
    pageHeight: number,
    margin: number = MARGIN,
  ) {
    const pageWidthWithMargin = pageWidth - margin;
    const pageHeightWithMargin = pageHeight - margin;
    const scale = Math.min(
      pageWidthWithMargin / itemWidth,
      pageHeightWithMargin / itemHeight,
    );

    const newWidth = scale < 1 ? itemWidth * scale : itemWidth;
    const newHeight = scale < 1 ? itemHeight * scale : itemHeight;

    const x = (pageWidthWithMargin - newWidth) / 2 + margin / 2;
    const y = (pageHeightWithMargin - newHeight) / 2 + margin / 2;

    return { newWidth, newHeight, x, y, isScaled: scale < 1 };
  }

  export(
    data: any,
    config: {
      size: 'A4' | 'letter';
      heading?: string | string[];
      fontSize?: number;
      fontColor?: string;
      fontFamily?: string;
      width: number;
      height: number;
    },
  ): Promise<ExportedData> {
    const {
      fontFamily = 'Arial',
      fontColor = '#000000',
      fontSize = 20,
      size,
      heading,
      width,
      height,
    } = config;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size,
        font: '',
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });

      let isScaled = false;
      // Collect chunks in an array
      const chunks: any[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () =>
        resolve({
          buffer: Buffer.concat(chunks),
          mimeType: 'application/pdf',
          metadata: {
            isScaled,
          },
        }),
      );
      doc.on('error', reject);

      let registeredFonts = false;
      const renderHeadingIfPresent = (index: number) => {
        if (heading) {
          if (!registeredFonts) {
            doc.registerFont(fontFamily, `fonts/${fontFamily}.ttf`);
            registeredFonts = true;
          }

          doc
            .font(fontFamily)
            .fontSize(fontSize)
            .fillColor(fontColor)
            .text(Array.isArray(heading) ? heading[index] : heading, 50, 50, {
              align: 'center',
              width: doc.page.width - 100,
            });
        }
      };

      // Get the actual page width and height from PDFKit:
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      const addPage = (item: any, index: number) => {
        if (index > 0) {
          doc.addPage({
            size,
            margins: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          });
        }

        renderHeadingIfPresent(index);

        if (isSvg(item)) {
          const {
            newWidth,
            newHeight,
            x,
            y,
            isScaled: isSvgScaled,
          } = this.calculateScaleAndPosition(
            width,
            height,
            pageWidth,
            pageHeight,
          );

          isScaled = isSvgScaled;
          SVGtoPDF(doc, item, x, y, {
            width: newWidth,
            height: newHeight,
          });
        } else if (isCanvas(item)) {
          const canvasWidth = width ?? item.width;
          const canvasHeight = height ?? item.height;
          const {
            newWidth,
            newHeight,
            x,
            y,
            isScaled: isCanvasScaled,
          } = this.calculateScaleAndPosition(
            canvasWidth,
            canvasHeight,
            pageWidth,
            pageHeight,
          );

          isScaled = isCanvasScaled;
          doc.image(item.toBuffer('image/png'), x, y, {
            width: newWidth,
            height: newHeight,
          });
        } else {
          throw new Error('Unsupported item type');
        }
      };

      if (Array.isArray(data)) {
        data.forEach((item: any, index) => {
          addPage(item, index);
        });
      } else {
        addPage(data, 0);
      }

      doc.end();
    });
  }
}
