import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas,
  Image,
  loadImage,
  registerFont,
} from "canvas";
import * as fs from "fs";

registerFont("fonts/Arial.ttf", { family: "Arial" });

interface WatermarkOptions {
  fontSize?: number;
  color?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  padding?: number;
  rotation?: number;
  outputFile?: string;
}

/**
 * Adds a watermark to an image and saves the result.
 * @param inputFile Path to the input image file.
 * @param watermarkText Text to use as the watermark.
 * @param options Optional configuration for watermark appearance and position.
 */
export async function addWatermark(
  inputFile: string | Buffer | Canvas,
  watermarkText: string,
  options: WatermarkOptions = {},
) {
  // Create canvas with image dimensions
  let canvas: Canvas;
  let ctx: CanvasRenderingContext2D;

  if (inputFile instanceof Canvas) {
    canvas = inputFile;
    ctx = canvas.getContext("2d");
  } else {
    // Load the base image
    const image: Image = await loadImage(inputFile);

    canvas = createCanvas(image.width, image.height);
    ctx = canvas.getContext("2d");

    // Draw the original image
    ctx.drawImage(image, 0, 0);
  }

  // Watermark options
  const fontSize = options.fontSize ?? 30;
  const fontColor = options.color ?? "rgba(255, 0, 0, 0.3)";
  const position = options.position ?? "center";
  const padding = options.padding ?? 20;
  const rotation = options.rotation ?? 0; // Rotation in degrees (default 0)

  // Set font and style
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = fontColor;
  ctx.textBaseline = "middle"; // For vertical centering

  // Measure text size
  const textWidth = ctx.measureText(watermarkText).width;
  const textHeight = fontSize; // or you can measure advanced metrics

  // Calculate position
  let x = 0;
  let y = 0;

  switch (position) {
    case "top-left":
      x = padding;
      y = padding + fontSize;
      break;
    case "top-right":
      x = canvas.width - textWidth - padding;
      y = padding + fontSize;
      break;
    case "bottom-left":
      x = padding;
      y = canvas.height - padding;
      break;
    case "bottom-right":
      x = canvas.width - textWidth - padding;
      y = canvas.height - padding;
      break;
    case "center":
      x = (canvas.width - textWidth) / 2;
      y = canvas.height / 2;
      break;
    default:
      throw new Error("Invalid position value");
  }

  // Apply rotation around the text center
  if (rotation !== 0) {
    const radians = (rotation * Math.PI) / 180;
    const centerX = x + textWidth / 2;
    const centerY = y;

    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.translate(-centerX, -centerY);
  }

  // Add watermark text
  ctx.fillText(watermarkText, x, y);

  if (options.outputFile) {
    // Save the watermarked image
    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync(options.outputFile, buffer);
    console.log(`Watermarked image saved as ${options.outputFile}`);
  }

  return canvas;
}

export function safeDeleteFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    // Ignore errors
  }
}
