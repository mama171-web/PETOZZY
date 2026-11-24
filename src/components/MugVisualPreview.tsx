import React, { useEffect, useRef, useState } from 'react';
import { PastelColor, Language } from '../types';

export type LivingRoomSceneId = 'oak' | 'scandi' | 'walnut' | 'marble';

interface MugVisualPreviewProps {
  photoUrl: string;
  petName: string;
  interiorColor: PastelColor;
  colorLabel: string;
  size?: 'mini' | 'md' | 'lg';
  scene?: LivingRoomSceneId;
  onSceneChange?: (scene: LivingRoomSceneId) => void;
  sceneLabels?: { oak: string; scandi: string; walnut: string; marble: string };
  currentLang?: Language;
  bgRemovedLabel?: string;
  removingBgLabel?: string;
}

interface SceneCalibration {
  src: string;
  mugLeft: number;
  mugRight: number;
  mugTopRimY: number;
  mugBottomY: number;
  bowlCx: number;
  bowlCy: number;
  bowlRx: number;
  bowlRy: number;
  printWidthRatio: number;
  printTopY: number;
  printHeight: number;
  curveDepthPx: number;
}

const SCENES: Record<LivingRoomSceneId, SceneCalibration> = {
  oak: {
    src: '/src/assets/images/living_room_mug_oak_table_1794932931523.jpg',
    mugLeft: 0.3625,
    mugRight: 0.6333,
    mugTopRimY: 0.362,
    mugBottomY: 0.818,
    bowlCx: 0.498,
    bowlCy: 0.386,
    bowlRx: 0.128,
    bowlRy: 0.025,
    printWidthRatio: 0.68,
    printTopY: 0.448,
    printHeight: 0.31,
    curveDepthPx: 14,
  },
  scandi: {
    src: '/src/assets/images/living_room_mug_scandi_table_1794932932543.jpg',
    mugLeft: 0.398,
    mugRight: 0.58,
    mugTopRimY: 0.417,
    mugBottomY: 0.758,
    bowlCx: 0.491,
    bowlCy: 0.438,
    bowlRx: 0.084,
    bowlRy: 0.02,
    printWidthRatio: 0.72,
    printTopY: 0.478,
    printHeight: 0.245,
    curveDepthPx: 10,
  },
  walnut: {
    src: '/src/assets/images/living_room_mug_walnut_table_1795459335816.jpg',
    mugLeft: 0.372,
    mugRight: 0.628,
    mugTopRimY: 0.325,
    mugBottomY: 0.785,
    bowlCx: 0.501,
    bowlCy: 0.352,
    bowlRx: 0.118,
    bowlRy: 0.024,
    printWidthRatio: 0.69,
    printTopY: 0.415,
    printHeight: 0.30,
    curveDepthPx: 12,
  },
  marble: {
    src: '/src/assets/images/living_room_mug_marble_table_1795459336029.jpg',
    mugLeft: 0.365,
    mugRight: 0.625,
    mugTopRimY: 0.348,
    mugBottomY: 0.812,
    bowlCx: 0.495,
    bowlCy: 0.375,
    bowlRx: 0.122,
    bowlRy: 0.026,
    printWidthRatio: 0.68,
    printTopY: 0.435,
    printHeight: 0.31,
    curveDepthPx: 13,
  },
};

function createLineArtImage(img: HTMLImageElement, w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  const imgAspect = img.naturalWidth / img.naturalHeight;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgAspect > 1) {
    sw = img.naturalHeight;
    sx = (img.naturalWidth - sw) / 2;
  } else if (imgAspect < 1) {
    sh = img.naturalWidth;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const gray = new Float32Array(w * h);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      gray[p] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    }

    const output = ctx.createImageData(w, h);
    const outData = output.data;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const gx = 
          -gray[(y - 1) * w + (x - 1)] - 2 * gray[y * w + (x - 1)] - gray[(y + 1) * w + (x - 1)] +
           gray[(y - 1) * w + (x + 1)] + 2 * gray[y * w + (x + 1)] + gray[(y + 1) * w + (x + 1)];

        const gy = 
          -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)] +
           gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];

        const mag = Math.sqrt(gx * gx + gy * gy);
        const isEdge = mag > 28;
        const outIdx = idx * 4;
        if (isEdge) {
          outData[outIdx] = 30;     // R (#1E324B)
          outData[outIdx + 1] = 50; // G
          outData[outIdx + 2] = 75; // B
          outData[outIdx + 3] = 255;
        } else {
          outData[outIdx] = 255;
          outData[outIdx + 1] = 255;
          outData[outIdx + 2] = 255;
          outData[outIdx + 3] = 255;
        }
      }
    }
    ctx.putImageData(output, 0, 0);
  } catch {
    // fallback
  }
  return canvas;
}

export const MugVisualPreview: React.FC<MugVisualPreviewProps> = ({
  photoUrl,
  petName,
  interiorColor,
  colorLabel,
  size = 'lg',
  scene: externalScene,
  onSceneChange,
  sceneLabels,
  currentLang = 'es',
}) => {
  const [internalScene, setInternalScene] = useState<LivingRoomSceneId>('oak');
  const activeSceneId = externalScene ?? internalScene;
  const setScene = onSceneChange ?? setInternalScene;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const sceneImgCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const petImgCacheRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    if (size === 'mini') return;
    let cancelled = false;

    const cal = SCENES[activeSceneId];

    const loadImage = (
      src: string,
      cache: Record<string, HTMLImageElement>
    ): Promise<HTMLImageElement> => {
      if (cache[src] && cache[src].complete && cache[src].naturalWidth > 0) {
        return Promise.resolve(cache[src]);
      }
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => {
          cache[src] = img;
          resolve(img);
        };
        img.onerror = (err) => reject(err);
        img.src = src;
      });
    };

    const drawComposite = async () => {
      try {
        const bgImg = await loadImage(cal.src, sceneImgCacheRef.current);
        let petImg: HTMLImageElement | null = null;
        if (photoUrl) {
          try {
            petImg = await loadImage(photoUrl, petImgCacheRef.current);
          } catch {
            petImg = null;
          }
        }
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 1200;
        const H = 896;
        if (canvas.width !== W || canvas.height !== H) {
          canvas.width = W;
          canvas.height = H;
        }

        ctx.clearRect(0, 0, W, H);

        // 1. Base photorealistic living room photograph
        ctx.drawImage(bgImg, 0, 0, W, H);

        // 2. Ceramic glazed pastel interior bowl tint
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          cal.bowlCx * W,
          cal.bowlCy * H,
          cal.bowlRx * W,
          cal.bowlRy * H,
          0,
          0,
          Math.PI * 2
        );
        ctx.clip();

        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.90;
        ctx.fillStyle = interiorColor.hex;
        ctx.fillRect(
          (cal.bowlCx - cal.bowlRx - 0.02) * W,
          (cal.bowlCy - cal.bowlRy - 0.02) * H,
          (cal.bowlRx * 2 + 0.04) * W,
          (cal.bowlRy * 2 + 0.04) * H
        );

        const rimGrad = ctx.createLinearGradient(
          (cal.bowlCx - cal.bowlRx) * W,
          cal.bowlCy * H,
          (cal.bowlCx + cal.bowlRx) * W,
          cal.bowlCy * H
        );
        rimGrad.addColorStop(0, 'rgba(0,0,0,0.08)');
        rimGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        rimGrad.addColorStop(1, 'rgba(255,255,255,0.25)');
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = rimGrad;
        ctx.fillRect(
          (cal.bowlCx - cal.bowlRx) * W,
          (cal.bowlCy - cal.bowlRy) * H,
          cal.bowlRx * 2 * W,
          cal.bowlRy * 2 * H
        );
        ctx.restore();

        // 3. Offscreen artwork canvas (pet portrait + pet name)
        const artW = 460;
        const artH = 520;
        const artCanvas = document.createElement('canvas');
        artCanvas.width = artW;
        artCanvas.height = artH;
        const actx = artCanvas.getContext('2d');

        if (actx) {
          actx.clearRect(0, 0, artW, artH);

          const frameSize = 336;
          const frameX = (artW - frameSize) / 2;
          const frameY = 18;
          const radius = 34;

          actx.save();
          actx.beginPath();
          actx.roundRect(frameX, frameY, frameSize, frameSize, radius);
          actx.clip();

          if (petImg) {
            const lineCanvas = createLineArtImage(petImg, frameSize, frameSize);
            actx.drawImage(lineCanvas, frameX, frameY);
          } else {
            actx.fillStyle = '#EDF2F8';
            actx.fillRect(frameX, frameY, frameSize, frameSize);
          }
          actx.restore();

          actx.save();
          actx.strokeStyle = 'rgba(30, 50, 75, 0.22)';
          actx.lineWidth = 4;
          actx.beginPath();
          actx.roundRect(frameX, frameY, frameSize, frameSize, radius);
          actx.stroke();
          actx.restore();

          const displayName = (petName || 'Buddy').trim().slice(0, 18);
          actx.save();
          actx.font = '800 56px "Quicksand", "Nunito", sans-serif';
          actx.textAlign = 'center';
          actx.textBaseline = 'middle';
          actx.fillStyle = '#1E324B';
          actx.fillText(displayName, artW / 2, frameY + frameSize + 64);

          actx.font = '700 18px "Nunito", sans-serif';
          actx.fillStyle = 'rgba(59, 91, 130, 0.88)';
          actx.fillText('PETOZZY', artW / 2, frameY + frameSize + 114);
          actx.restore();

          // 4. Cylindrical perspective mapping onto mug
          const mugCenterPx = ((cal.mugLeft + cal.mugRight) / 2) * W;
          const mugWidthPx = (cal.mugRight - cal.mugLeft) * W;
          const targetWidth = mugWidthPx * cal.printWidthRatio;
          const targetStartX = mugCenterPx - targetWidth / 2;
          const targetTopY = cal.printTopY * H;
          const targetHeight = cal.printHeight * H;

          const slices = 120;
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';

          for (let i = 0; i < slices; i++) {
            const t0 = i / slices;
            const t1 = (i + 1) / slices;
            const maxAngle = Math.PI * 0.35;
            const a0 = (t0 - 0.5) * 2 * maxAngle;
            const a1 = (t1 - 0.5) * 2 * maxAngle;

            const normX0 = (Math.sin(a0) / Math.sin(maxAngle) + 1) / 2;
            const normX1 = (Math.sin(a1) / Math.sin(maxAngle) + 1) / 2;

            const destX = targetStartX + normX0 * targetWidth;
            const destW = Math.max(1, (normX1 - normX0) * targetWidth + 0.6);

            const tMid = (t0 + t1) / 2;
            const angleMid = (tMid - 0.5) * 2 * maxAngle;
            const curveY =
              cal.curveDepthPx * ((Math.cos(angleMid) - Math.cos(maxAngle)) / (1 - Math.cos(maxAngle)));

            const edgeCos = Math.cos(angleMid);
            ctx.globalAlpha = 0.76 + 0.18 * edgeCos;

            const sx = t0 * artW;
            const sw = (t1 - t0) * artW;
            ctx.drawImage(
              artCanvas,
              sx,
              0,
              sw,
              artH,
              destX,
              targetTopY + curveY,
              destW,
              targetHeight
            );
          }
          ctx.restore();

          // 5. Specular gloss highlight
          ctx.save();
          const glossX = (cal.mugLeft + (cal.mugRight - cal.mugLeft) * 0.15) * W;
          const glossW = mugWidthPx * 0.15;
          const glossGrad = ctx.createLinearGradient(glossX, 0, glossX + glossW, 0);
          glossGrad.addColorStop(0, 'rgba(255,255,255,0)');
          glossGrad.addColorStop(0.5, 'rgba(255,255,255,0.24)');
          glossGrad.addColorStop(1, 'rgba(255,255,255,0)');

          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = glossGrad;
          ctx.fillRect(
            glossX,
            cal.printTopY * H,
            glossW,
            cal.printHeight * H
          );
          ctx.restore();
        }

        setSceneReady(true);
      } catch {
        setSceneReady(false);
      }
    };

    drawComposite();

    return () => {
      cancelled = true;
    };
  }, [photoUrl, petName, interiorColor.hex, activeSceneId, size]);

  if (size === 'mini') {
    return (
      <div className="relative w-20 h-22 mx-auto flex items-center justify-center select-none">
        <div
          className="absolute top-5 right-0 w-5 h-11 rounded-r-full border-[4px] transition-colors duration-200"
          style={{ borderColor: interiorColor.hex }}
        />
        <div className="relative z-10 w-16 h-20 mr-2 rounded-b-xl rounded-t-md bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div
            className="w-full h-3.5 transition-colors duration-200 relative"
            style={{ backgroundColor: interiorColor.hex }}
          >
            <div className="h-1.5 bg-black/10 rounded-full mt-0.5 mx-auto w-[85%]" />
          </div>
          <div className="flex-1 p-1 flex flex-col items-center justify-center bg-gradient-to-r from-slate-50 via-white to-slate-50">
            <div className="w-9 h-9 rounded-md overflow-hidden border border-slate-200 mb-0.5">
              <img
                src={photoUrl}
                alt={petName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[8px] font-extrabold text-[#1E324B] truncate max-w-[52px]">
              {petName || 'Pet'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2.5">
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#EDF2F8] border border-[#C3D1E2]/70 shadow-sm">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover block transition-opacity duration-150 ${
            sceneReady ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label={`${petName || 'Pet'} · ${colorLabel}`}
        />

        {!sceneReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#EDF2F8]">
            <img
              src={SCENES[activeSceneId].src}
              alt={petName || 'Petozzy Mug'}
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-[#C3D1E2] flex items-center gap-1.5 text-[10px] font-bold text-[#1E324B] shadow-xs">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
            style={{ backgroundColor: interiorColor.hex }}
          />
          <span>{colorLabel}</span>
        </div>
      </div>

      {size === 'lg' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {(['oak', 'scandi', 'walnut', 'marble'] as LivingRoomSceneId[]).map((sKey) => {
            const isActive = activeSceneId === sKey;
            const defaultLabels = {
              oak: currentLang === 'pt' ? 'Carvalho' : currentLang === 'es' ? 'Roble cálido' : 'Roure càlid',
              scandi: currentLang === 'pt' ? 'Nórdico' : currentLang === 'es' ? 'Nórdico' : 'Nórdic',
              walnut: currentLang === 'pt' ? 'Nogueira' : currentLang === 'es' ? 'Nogal oscuro' : 'Noguera',
              marble: currentLang === 'pt' ? 'Mármore' : currentLang === 'es' ? 'Mármol blanco' : 'Marbre blanc',
            };
            const labelText = sceneLabels?.[sKey] || defaultLabels[sKey];

            return (
              <button
                key={sKey}
                type="button"
                onClick={() => setScene(sKey)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer truncate ${
                  isActive
                    ? 'bg-[#243B53] text-white border-[#243B53]'
                    : 'bg-[#F7F9FC] text-slate-600 border-[#C3D1E2] hover:bg-[#EDF2F8]'
                }`}
              >
                {labelText}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
