/**
 * Canvas-based share card generator for D-Day events.
 * Produces a 1080x1080 (Instagram square) PNG.
 */

interface ShareCardOptions {
  title: string;
  targetDate: string;
  color: string;      // accent color (hex)
  ddayLabel: string;  // e.g. "D-14", "D-Day", "D+3"
  relativeLabel: string; // e.g. "14일 후"
  note?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function darken(hex: string, amount = 40): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amount)},${Math.max(0,g-amount)},${Math.max(0,b-amount)})`;
}

function formatDateKo(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export async function generateShareCard(opts: ShareCardOptions): Promise<Blob> {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient ──────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, opts.color);
  grad.addColorStop(1, darken(opts.color, 60));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Subtle circle decoration ─────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.15, 320, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SIZE * 0.1, SIZE * 0.9, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Brand label (top-left) ───────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'bold 36px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('D-Day', 80, 100);

  // ── D-day main label ─────────────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `bold 220px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
  // Scale down if label is long (e.g. "D+100")
  const labelLen = opts.ddayLabel.length;
  const fontSize = labelLen > 5 ? 160 : labelLen > 4 ? 190 : 220;
  ctx.font = `bold ${fontSize}px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
  ctx.fillText(opts.ddayLabel, SIZE / 2, SIZE / 2 - 20);

  // ── Relative label (e.g. "14일 후") ────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `500 52px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
  ctx.fillText(opts.relativeLabel, SIZE / 2, SIZE / 2 + 70);

  // ── Divider ──────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 160, SIZE / 2 + 120);
  ctx.lineTo(SIZE / 2 + 160, SIZE / 2 + 120);
  ctx.stroke();

  // ── Event title ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 64px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
  // Truncate title if too long
  const maxTitleWidth = SIZE - 160;
  let titleText = opts.title;
  while (ctx.measureText(titleText).width > maxTitleWidth && titleText.length > 4) {
    titleText = titleText.slice(0, -1);
  }
  if (titleText !== opts.title) titleText += '…';
  ctx.fillText(titleText, SIZE / 2, SIZE / 2 + 230);

  // ── Date ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `400 40px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
  ctx.fillText(formatDateKo(opts.targetDate), SIZE / 2, SIZE / 2 + 310);

  // ── Note (if short enough) ───────────────────────────────────────────────
  if (opts.note && opts.note.length < 40) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `400 34px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
    ctx.fillText(opts.note, SIZE / 2, SIZE / 2 + 390);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

export async function shareOrDownload(blob: Blob, filename: string): Promise<'shared' | 'downloaded'> {
  // Web Share API (mobile) — share as file if supported
  if (navigator.share && navigator.canShare?.({ files: [new File([blob], filename, { type: 'image/png' })] })) {
    await navigator.share({
      files: [new File([blob], filename, { type: 'image/png' })],
      title: 'D-Day 카드',
    });
    return 'shared';
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
