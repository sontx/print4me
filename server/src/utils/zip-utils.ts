import * as archiver from 'archiver';
import { PassThrough } from 'stream';

export interface FileItem {
  name: string;
  buffer: Buffer;
}

export async function zipItems(items: FileItem[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Create a PassThrough stream to capture the archive output
    const passThrough = new PassThrough();
    const chunks: Uint8Array[] = [];

    // Collect chunks of data from the stream
    passThrough.on('data', (chunk) => chunks.push(chunk));
    passThrough.on('end', () => {
      // Combine all chunks into a single Buffer
      const zipBuffer = Buffer.concat(chunks);
      resolve(zipBuffer);
    });

    // Handle errors
    passThrough.on('error', (err) => reject(err));

    // Create an archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // Handle archive errors
    archive.on('error', (err) => reject(err));

    // Pipe the archive output to the PassThrough stream
    archive.pipe(passThrough);

    // Add each file item to the archive
    items.forEach((item) => {
      archive.append(item.buffer, { name: item.name });
    });

    // Finalize the archive
    archive.finalize();
  });
}
