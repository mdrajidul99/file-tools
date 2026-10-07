import JSZip from 'jszip';

export async function zipFiles(files: File[], zipFileName = 'archive.zip'): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file);
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  return content;
}

export async function createZipWithBlobs(
  entries: { name: string; blob: Blob }[],
  zipFileName = 'archive.zip'
): Promise<Blob> {
  const zip = new JSZip();

  for (const entry of entries) {
    zip.file(entry.name, entry.blob);
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  return content;
}
