// /src/public/utils/imageResize.ts
// 이미지 리사이즈 유틸리티

export type ResizeOption = {
  maxWidth?: number;   // ex) 1600
  maxHeight?: number;  // ex) 1600
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
  quality?: number;    // 0~1
};

export async function resizeImage(file: File, opt: ResizeOption = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    mimeType = 'image/webp',
    quality = 0.9,
  } = opt;

  const img = await blobToImage(file);
  const { width, height } = getContainSize(img.width, img.height, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('CanvasRenderingContext2D is null');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob 실패'))), mimeType, quality);
  });

  const ext = mimeType.split('/')[1] || 'webp';
  const resizedFile = new File([blob], renameExtension(file.name, ext), { type: mimeType, lastModified: Date.now() });
  return resizedFile;
}

function getContainSize(w: number, h: number, maxW: number, maxH: number) {
  const ratio = Math.min(maxW / w, maxH / h, 1);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

function blobToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function renameExtension(name: string, ext: string) {
  const i = name.lastIndexOf('.');
  const base = i >= 0 ? name.slice(0, i) : name;
  return `${base}.${ext}`;
}
