import { ExportedData, Exporter, isSvg } from "./exporter";

export class SvgExporter implements Exporter {
  async export(data: any): Promise<ExportedData> {
    if (Array.isArray(data)) {
      throw new Error("Cannot export an array of items to SVG");
    }

    if (isSvg(data)) {
      return {
        buffer: Buffer.from(data),
        mimeType: "image/svg+xml",
      };
    }

    throw new Error("Unsupported data type for SVG export");
  }
}
