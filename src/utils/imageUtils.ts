import { loadImage } from './fileUtils';

export interface ImageAdjustments {
  brightness?: number; // 50 to 150 (default 100)
  contrast?: number;   // 50 to 150 (default 100)
  grayscale?: number;  // 0 to 100 (default 0)
  sepia?: number;      // 0 to 100 (default 0)
  invert?: number;     // 0 to 100 (default 0)
  blur?: number;       // 0 to 20 px (default 0)
}

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number; // 0.1 to 1.0
  color?: string;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export async function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: number;
}> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(img.naturalWidth, img.naturalHeight);
    const aspect = `${Math.round(img.naturalWidth / divisor)}:${Math.round(img.naturalHeight / divisor)}`;
    const mp = parseFloat(((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2));
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      aspectRatio: aspect,
      megapixels: mp,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality = 0.92
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create blob'))),
        format,
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function cropImage(
  file: File,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  quality = 0.95
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cropWidth, cropHeight);
    }

    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to crop image'))),
        format,
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function rotateAndFlipImage(
  file: File,
  angleDegrees: number,
  flipH = false,
  flipV = false,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality = 0.95
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    const rad = (angleDegrees * Math.PI) / 180;
    const isPerpendicular = Math.abs(angleDegrees % 180) === 90;

    canvas.width = isPerpendicular ? img.naturalHeight : img.naturalWidth;
    canvas.height = isPerpendicular ? img.naturalWidth : img.naturalHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to rotate image'))),
        format,
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function processCanvasImage(
  file: File,
  options: {
    targetWidth?: number;
    targetHeight?: number;
    rotation?: number;
    flipH?: boolean;
    flipV?: boolean;
    filters?: ImageAdjustments;
    watermark?: WatermarkOptions;
    format?: 'image/jpeg' | 'image/png' | 'image/webp';
    quality?: number;
  }
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    const width = options.targetWidth || img.naturalWidth;
    const height = options.targetHeight || img.naturalHeight;
    const rotation = options.rotation || 0;
    const isPerpendicular = Math.abs(rotation % 180) === 90;

    canvas.width = isPerpendicular ? height : width;
    canvas.height = isPerpendicular ? width : height;

    const format = options.format || 'image/jpeg';
    const quality = options.quality ?? 0.92;

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Apply CSS filters if present
    if (options.filters) {
      const f = options.filters;
      const filterParts: string[] = [];
      if (f.brightness !== undefined) filterParts.push(`brightness(${f.brightness}%)`);
      if (f.contrast !== undefined) filterParts.push(`contrast(${f.contrast}%)`);
      if (f.grayscale !== undefined && f.grayscale > 0) filterParts.push(`grayscale(${f.grayscale}%)`);
      if (f.sepia !== undefined && f.sepia > 0) filterParts.push(`sepia(${f.sepia}%)`);
      if (f.invert !== undefined && f.invert > 0) filterParts.push(`invert(${f.invert}%)`);
      if (f.blur !== undefined && f.blur > 0) filterParts.push(`blur(${f.blur}px)`);
      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(' ');
      }
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();

    // Reset filter for watermark
    ctx.filter = 'none';

    // Watermark
    if (options.watermark && options.watermark.text.trim()) {
      const wm = options.watermark;
      const fontSize = wm.fontSize || Math.max(18, Math.round(canvas.width / 25));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = wm.color || '#ffffff';
      ctx.globalAlpha = wm.opacity ?? 0.6;
      ctx.textBaseline = 'middle';

      const padding = 20;
      const metrics = ctx.measureText(wm.text);
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      let align: CanvasTextAlign = 'center';

      switch (wm.position) {
        case 'top-left':
          x = padding;
          y = padding + fontSize / 2;
          align = 'left';
          break;
        case 'top-right':
          x = canvas.width - padding;
          y = padding + fontSize / 2;
          align = 'right';
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding - fontSize / 2;
          align = 'left';
          break;
        case 'bottom-right':
          x = canvas.width - padding;
          y = canvas.height - padding - fontSize / 2;
          align = 'right';
          break;
        case 'center':
        default:
          x = canvas.width / 2;
          y = canvas.height / 2;
          align = 'center';
          break;
      }

      ctx.textAlign = align;
      // Add subtle drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 6;
      ctx.fillText(wm.text, x, y);
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to process image'))),
        format,
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function convertSvgToRaster(
  svgFileOrString: File | string,
  targetFormat: 'image/png' | 'image/jpeg' = 'image/png',
  scale = 2
): Promise<Blob> {
  let svgUrl: string;
  let isObjectUrl = false;

  if (typeof svgFileOrString === 'string') {
    const blob = new Blob([svgFileOrString], { type: 'image/svg+xml;charset=utf-8' });
    svgUrl = URL.createObjectURL(blob);
    isObjectUrl = true;
  } else {
    svgUrl = URL.createObjectURL(svgFileOrString);
    isObjectUrl = true;
  }

  try {
    const img = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = (img.naturalWidth || 800) * scale;
    canvas.height = (img.naturalHeight || 600) * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to convert SVG'))),
        targetFormat,
        0.95
      );
    });
  } finally {
    if (isObjectUrl) URL.revokeObjectURL(svgUrl);
  }
}
