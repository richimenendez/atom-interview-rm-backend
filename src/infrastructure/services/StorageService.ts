import { storage } from '../config/firebase';

export class StorageService {
  private bucket = storage.bucket();

  async uploadFile(file: any, path: string): Promise<string> {
    const blob = this.bucket.file(path);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', async () => {
        // Hacer el archivo público
        await blob.makePublic();
        // Obtener la URL pública
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  async deleteFile(path: string): Promise<void> {
    await this.bucket.file(path).delete();
  }

  async getSignedUrl(path: string, expirationTimeSeconds = 3600): Promise<string> {
    const [url] = await this.bucket.file(path).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationTimeSeconds * 1000,
    });
    return url;
  }
} 