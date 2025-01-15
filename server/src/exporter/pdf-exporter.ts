import { ExportedData, Exporter, isCanvas, isSvg } from './exporter';
import * as PDFDocument from 'pdfkit';
import * as SVGtoPDF from 'svg-to-pdfkit';

export class PdfExporter implements Exporter {
  private doc!: PDFKit.PDFDocument;

  /**
   * Computes new width/height so that the item (SVG/Canvas) fits horizontally
   * within (pageWidth - 2 * margin) and vertically within (availableHeight),
   * preserving aspect ratio. The diagram will be horizontally centered, and
   * placed at `startY` (plus a margin below the heading).
   */
  private calculateScaleAndPosition(
    itemWidth: number,
    itemHeight: number,
    pageWidth: number,
    startY: number,
    margin: number
  ) {
    // We'll reserve margin on both sides for horizontal space.
    const availableWidth = pageWidth - 2 * margin;

    /**
     * We already have a heading that ends at `startY`.
     * We'll place the top of the item at `startY + MARGIN` (gap below heading).
     * We also want to respect the bottom margin, so the total space for the
     * item is: pageHeight - (startY + MARGIN) - MARGIN.
     */
    const pageHeight = this.doc.page.height;
    const availableHeight = pageHeight - (startY + margin) - margin;

    // Determine the scale factor so the item fits both width- and height-wise
    const scale = Math.min(
      availableWidth / itemWidth,
      availableHeight / itemHeight
    );

    // If scale < 1, shrink the item; if >= 1, item fits without scaling
    const newWidth = scale < 1 ? itemWidth * scale : itemWidth;
    const newHeight = scale < 1 ? itemHeight * scale : itemHeight;

    // Center horizontally
    const x = margin + (availableWidth - newWidth) / 2;
    // Place the top edge at `startY + MARGIN` (one margin below heading)
    const y = startY + margin;

    return {
      newWidth,
      newHeight,
      x,
      y,
      isScaled: scale < 1,
    };
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
      margin: number;
    }
  ): Promise<ExportedData> {
    const {
      fontFamily = 'Arial',
      fontColor = '#000000',
      fontSize = 20,
      size,
      heading,
      width,
      height,
      margin
    } = config;

    return new Promise((resolve, reject) => {
      // Create a new PDF document
      this.doc = new PDFDocument({
        size,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      const doc = this.doc;

      let isScaled = false;
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () =>
        resolve({
          buffer: Buffer.concat(chunks),
          mimeType: 'application/pdf',
          metadata: { isScaled },
        })
      );
      doc.on('error', reject);

      // Register the font only once
      let fontsRegistered = false;

      /**
       * Renders the heading at the top margin. Returns `doc.y` (where
       * the heading ends), so the maze can be placed below it.
       */
      const renderHeadingIfPresent = (index: number): number => {
        if (!heading) return margin; // If there's no heading, return top margin.

        if (!fontsRegistered) {
          doc.registerFont(fontFamily, `fonts/${fontFamily}.ttf`);
          fontsRegistered = true;
        }

        const headingStartY = margin; // Start at top margin
        // If heading is an array, use heading[index], otherwise use heading as string
        const text = Array.isArray(heading) ? heading[index] : heading;

        doc
          .font(fontFamily)
          .fontSize(fontSize)
          .fillColor(fontColor)
          .text(text, margin, headingStartY, {
            align: 'center',
            width: doc.page.width - 2 * margin,
          });

        // Return the y position after drawing the heading
        return doc.y;
      };

      /**
       * Adds a page (except for the first item) and renders heading + item (SVG/Canvas).
       */
      const addPage = (item: any, index: number) => {
        if (index > 0) {
          doc.addPage({ size, margins: { top: 0, bottom: 0, left: 0, right: 0 } });
        }

        // 1) Render heading
        const headingBottomY = renderHeadingIfPresent(index);

        // 2) Place the maze below heading
        if (isSvg(item)) {
          const { newWidth, newHeight, x, y, isScaled: svgScaled } =
            this.calculateScaleAndPosition(width, height, doc.page.width, headingBottomY, margin);

          isScaled = isScaled || svgScaled;
          SVGtoPDF(doc, item, x, y, { width: newWidth, height: newHeight });
        } else if (isCanvas(item)) {
          const canvasWidth = width ?? item.width;
          const canvasHeight = height ?? item.height;

          const { newWidth, newHeight, x, y, isScaled: canvasScaled } =
            this.calculateScaleAndPosition(canvasWidth, canvasHeight, doc.page.width, headingBottomY, margin);

          isScaled = isScaled || canvasScaled;
          doc.image(item.toBuffer('image/png'), x, y, {
            width: newWidth,
            height: newHeight,
          });
        } else {
          throw new Error('Unsupported item type');
        }
      };

      // If data is an array, each item gets its own page; otherwise, just one page
      if (Array.isArray(data)) {
        data.forEach((item: any, index) => addPage(item, index));
      } else {
        addPage(data, 0);
      }

      // Finish the PDF
      doc.end();
    });
  }
}
