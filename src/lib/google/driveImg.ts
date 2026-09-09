import { google } from 'googleapis';
import { Readable } from 'stream';


//
// Gunakan di +page.svelte untuk menyimpan data ke 1 drive pada google drive 
//

// Konfigurasi Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: 'jalur/ke/file-kredensial-google-anda.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'] // Scope akses file
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Helper internal untuk mengubah Web API File menjadi Node.js Readable Stream
 */
async function fileToStream(file: File): Promise<Readable> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return Readable.from(buffer);
}

/**
 *  Menambah / Mengunggah File Baru ke Google Drive
 */
export async function saveToDrive(file: File, folderId?: string) {
  const mediaStream = await fileToStream(file);

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: folderId ? [folderId] : undefined
    },
    media: {
      mimeType: file.type,
      body: mediaStream
    },
    fields: 'id, name'
  });

  return response.data; // Mengembalikan { id, name }
}

/**
 *  Mengubah / Memperbarui Isi File yang Sudah Ada
 */
export async function updateInDrive(fileId: string, file: File) {
  const mediaStream = await fileToStream(file);

  const response = await drive.files.update({
    fileId: fileId,
    requestBody: {
      name: file.name
    },
    media: {
      mimeType: file.type,
      body: mediaStream
    },
    fields: 'id, name'
  });

  return response.data; // Mengembalikan { id, name }
}

/**
 * Method 3: Menghapus File dari Google Drive Berdasarkan File ID
 */
export async function deleteFromDrive(fileId: string) {
  await drive.files.delete({
    fileId: fileId
  });

  return true;
};
