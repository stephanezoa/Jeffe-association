import { Request, Response, NextFunction } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';

/** Répertoire de stockage, servi en statique sous /uploads par app.ts. */
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

const MAX_BYTES = 1_500_000; // ~1 Mo d'image + surcoût base64

/**
 * Upload d'image sans dépendance multipart : le client envoie le data URL
 * produit par la zone de dépôt, on le décode et on écrit le fichier sur disque.
 */
export class UploadsController {
  public upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { dataUrl } = req.body as { dataUrl?: string };
      const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl ?? '');
      if (!match) {
        throw AppError.badRequest('Image invalide : un data URL base64 est attendu.', 'UPLOAD_INVALID');
      }

      const [, mime, base64] = match;
      const ext = EXT_BY_MIME[mime];
      if (!ext) throw AppError.badRequest('Format d’image non pris en charge.', 'UPLOAD_UNSUPPORTED');

      const buffer = Buffer.from(base64, 'base64');
      if (buffer.byteLength > MAX_BYTES) {
        throw AppError.badRequest('Image trop volumineuse (max 1 mo).', 'UPLOAD_TOO_LARGE');
      }

      await mkdir(UPLOADS_DIR, { recursive: true });
      const filename = `${uuidv4()}.${ext}`;
      await writeFile(path.join(UPLOADS_DIR, filename), buffer);

      res.status(201).json({ data: { url: `/uploads/${filename}` } });
    } catch (err) {
      next(err);
    }
  };
}
