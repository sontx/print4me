import { Canvas } from "canvas";

export interface ExportedData {
  buffer: Buffer;
  mimeType: string;
  metadata?: any;
}

export interface Exporter {
  export(data: any, config?: any): Promise<ExportedData>;
}

export const isSvg = (item: any) => typeof item === "string" && item.includes("<svg");
export const isCanvas = (item: any) => item instanceof Canvas;
