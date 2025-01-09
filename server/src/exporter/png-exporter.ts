import { ExportedData, Exporter, isCanvas } from "./exporter";

export class PngExporter implements Exporter {
  async export(data: any): Promise<ExportedData> {
    if (Array.isArray(data)) {
      throw new Error("Cannot export an array of items to PNG");
    }

    if (isCanvas(data)) {
      return {
        buffer: data.toBuffer("image/png"),
        mimeType: "image/png",
      };
    }

    throw new Error("Unsupported data type for PNG export");
  }
}
