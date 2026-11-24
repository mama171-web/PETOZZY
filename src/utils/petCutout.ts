export interface ContourPoint {
  x: number; // normalized 0..1000
  y: number; // normalized 0..1000
}

export interface AiSegmentationHint {
  detected: boolean;
  bbox?: { ymin: number; xmin: number; ymax: number; xmax: number } | null;
  contour: ContourPoint[];
}

export interface CutoutResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  aiAssisted: boolean;
  hasCutout: boolean;
}

const cutoutCache = new Map<string, CutoutResult>();
const aiHintCache = new Map<string, Promise<AiSegmentationHint>>();

function colorDist(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  // Weighted perceptual RGB distance
  return Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
}

function getPixelChroma(r: number, g: number, b: number): number {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

/**
 * Queries server-side multimodal gemini-4-hydrogen once per uploaded photo
 * to obtain a tight foreground polygon contour around the pet head & shoulders.
 */
export function fetchAiSegmentation(
  photoUrl: string,
  img: HTMLImageElement
): Promise<AiSegmentationHint> {
  if (aiHintCache.has(photoUrl)) {
    return aiHintCache.get(photoUrl)!;
  }

  const promise = (async (): Promise<AiSegmentationHint> => {
    try {
      const maxDim = 512;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(64, Math.round(img.naturalWidth * scale));
      const h = Math.max(64, Math.round(img.naturalHeight * scale));

      const tmp = document.createElement('canvas');
      tmp.width = w;
      tmp.height = h;
      const tctx = tmp.getContext('2d');
      if (!tctx) return { detected: false, contour: [] };

      tctx.drawImage(img, 0, 0, w, h);
      const dataUrl = tmp.toDataURL('image/jpeg', 0.82);
      const base64 = dataUrl.split(',')[1] || '';
      if (!base64) return { detected: false, contour: [] };

      const res = await fetch('/api/segment-pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
      });
      if (!res.ok) return { detected: false, contour: [] };

      const json = (await res.json()) as AiSegmentationHint;
      return {
        detected: Boolean(json?.detected && Array.isArray(json.contour) && json.contour.length >= 5),
        bbox: json?.bbox || null,
        contour: Array.isArray(json?.contour) ? json.contour : [],
      };
    } catch {
      return { detected: false, contour: [] };
    }
  })();

  aiHintCache.set(photoUrl, promise);
  return promise;
}

/**
 * Automatically removes background pixels from a pet portrait using:
 * 1) Edge-seeded perceptual color BFS flood-fill (keeps white chest/fur inside safe!)
 * 2) Optional AI polygon guidance to trim distant cluttered room/outdoor backgrounds
 * 3) Soft boundary alpha feathering + edge color decontamination (zero halo border)
 * 4) Tight bounding-box auto-crop around the extracted animal
 */
export function extractPetCutout(
  img: HTMLImageElement,
  cacheKey: string,
  aiHint?: AiSegmentationHint
): CutoutResult {
  const aiKey = aiHint?.detected ? `${cacheKey}::ai` : `${cacheKey}::local`;
  const existing = cutoutCache.get(aiKey);
  if (existing) {
    return existing;
  }

  const maxSide = 680;
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(32, Math.round(img.naturalWidth * scale));
  const h = Math.max(32, Math.round(img.naturalHeight * scale));

  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const ctx = work.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return {
      canvas: work,
      dataUrl: work.toDataURL('image/png'),
      aiAssisted: false,
      hasCutout: false,
    };
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const totalPixels = w * h;

  // Build optional dilated AI foreground mask (1 = inside pet region, 0 = outside)
  let aiFgMask: Uint8Array | null = null;
  if (aiHint?.detected && aiHint.contour.length >= 5) {
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mctx = maskCanvas.getContext('2d');
    if (mctx) {
      mctx.clearRect(0, 0, w, h);
      mctx.fillStyle = '#ffffff';
      mctx.strokeStyle = '#ffffff';
      // Slight generous outward dilation so fur/ears/whiskers aren't clipped tightly
      mctx.lineWidth = Math.max(12, Math.round(Math.min(w, h) * 0.055));
      mctx.lineJoin = 'round';
      mctx.beginPath();
      aiHint.contour.forEach((pt, idx) => {
        const px = (pt.x / 1000) * w;
        const py = (pt.y / 1000) * h;
        if (idx === 0) mctx.moveTo(px, py);
        else mctx.lineTo(px, py);
      });
      mctx.closePath();
      mctx.fill();
      mctx.stroke();

      const mData = mctx.getImageData(0, 0, w, h).data;
      aiFgMask = new Uint8Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        aiFgMask[i] = mData[i * 4 + 3] > 60 ? 1 : 0;
      }
    }
  }

  // Sample border palette buckets from top, left, right edges (plus upper-half sides; bottom often contains pet's chest)
  interface Bucket {
    rSum: number;
    gSum: number;
    bSum: number;
    count: number;
  }
  const buckets = new Map<string, Bucket>();
  const addSample = (x: number, y: number) => {
    const idx = (y * w + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const bucket = buckets.get(key) || { rSum: 0, gSum: 0, bSum: 0, count: 0 };
    bucket.rSum += r;
    bucket.gSum += g;
    bucket.bSum += b;
    bucket.count += 1;
    buckets.set(key, bucket);
  };

  for (let x = 0; x < w; x++) {
    addSample(x, 0);
    addSample(x, 1);
  }
  for (let y = 0; y < Math.floor(h * 0.72); y++) {
    addSample(0, y);
    addSample(w - 1, y);
  }

  const dominantClusters = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((b) => ({
      r: b.rSum / b.count,
      g: b.gSum / b.count,
      b: b.bSum / b.count,
      lum: (0.299 * b.rSum + 0.587 * b.gSum + 0.114 * b.bSum) / b.count,
      chroma: getPixelChroma(b.rSum / b.count, b.gSum / b.count, b.bSum / b.count),
    }));

  const isStudioLightBg =
    dominantClusters.length > 0 &&
    dominantClusters[0].lum > 236 &&
    dominantClusters[0].chroma < 12;

  // Thresholds tuned carefully: studio white requires stricter chroma check so cream/white fur (e.g. Daisy) isn't flooded
  const clusterThreshold = isStudioLightBg ? 18 : 34;
  const localStepThreshold = isStudioLightBg ? 11 : 18;

  // 4-Edge Connected Flood Fill
  const bgMask = new Uint8Array(totalPixels); // 1 = background, 0 = foreground
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const matchesBgCluster = (r: number, g: number, b: number, insideAiMask: boolean): boolean => {
    const chroma = getPixelChroma(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (isStudioLightBg) {
      // Pure neutral near-white studio background vs cream/colored fur
      if (lum >= 242 && chroma <= 8) return true;
    }

    for (const c of dominantClusters) {
      const dist = colorDist(r, g, b, c.r, c.g, c.b);
      const limit = insideAiMask ? clusterThreshold * 0.78 : clusterThreshold;
      if (dist <= limit) {
        if (isStudioLightBg && chroma > 12) return false;
        return true;
      }
    }
    return false;
  };

  const enqueueIfBg = (x: number, y: number) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const pos = y * w + x;
    if (visited[pos]) return;
    visited[pos] = 1;

    const pIdx = pos * 4;
    if (data[pIdx + 3] < 20) {
      bgMask[pos] = 1;
      queue[tail++] = pos;
      return;
    }

    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    const inAi = aiFgMask ? aiFgMask[pos] === 1 : false;

    if (!inAi && aiFgMask) {
      bgMask[pos] = 1;
      queue[tail++] = pos;
      return;
    }

    if (matchesBgCluster(r, g, b, inAi)) {
      bgMask[pos] = 1;
      queue[tail++] = pos;
    }
  };

  // Seed flood fill from all 4 image borders
  for (let x = 0; x < w; x++) {
    enqueueIfBg(x, 0);
    enqueueIfBg(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    enqueueIfBg(0, y);
    enqueueIfBg(w - 1, y);
  }

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  while (head < tail) {
    const pos = queue[head++];
    const cx = pos % w;
    const cy = (pos - cx) / w;
    const cIdx = pos * 4;
    const cr = data[cIdx];
    const cg = data[cIdx + 1];
    const cb = data[cIdx + 2];

    for (let k = 0; k < 4; k++) {
      const nx = cx + dx[k];
      const ny = cy + dy[k];
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      const nPos = ny * w + nx;
      if (visited[nPos]) continue;
      visited[nPos] = 1;

      const nIdx = nPos * 4;
      const nr = data[nIdx];
      const ng = data[nIdx + 1];
      const nb = data[nIdx + 2];
      const inAi = aiFgMask ? aiFgMask[nPos] === 1 : false;

      // Pixels strictly outside dilated AI pet mask are background
      if (aiFgMask && !inAi) {
        bgMask[nPos] = 1;
        queue[tail++] = nPos;
        continue;
      }

      const stepDist = colorDist(cr, cg, cb, nr, ng, nb);
      const canStep =
        stepDist <= localStepThreshold &&
        (!isStudioLightBg || (getPixelChroma(nr, ng, nb) <= 13 && 0.299 * nr + 0.587 * ng + 0.114 * nb >= 224));

      if (canStep || matchesBgCluster(nr, ng, nb, inAi)) {
        bgMask[nPos] = 1;
        queue[tail++] = nPos;
      }
    }
  }

  // Soft 2.5px alpha feathering + mild halo color decontamination around boundary pixels
  const alphaOut = new Uint8ClampedArray(totalPixels);
  let fgCount = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pos = y * w + x;
      if (bgMask[pos] === 1) {
        alphaOut[pos] = 0;
        continue;
      }

      fgCount++;
      // Check 2-pixel neighborhood for boundary softness
      let bgNeighbors = 0;
      let totalNeighbors = 0;
      let innerR = 0;
      let innerG = 0;
      let innerB = 0;
      let innerWeight = 0;

      for (let oy = -2; oy <= 2; oy++) {
        const ny = y + oy;
        if (ny < 0 || ny >= h) continue;
        for (let ox = -2; ox <= 2; ox++) {
          const nx = x + ox;
          if (nx < 0 || nx >= w || (ox === 0 && oy === 0)) continue;
          const dist2 = ox * ox + oy * oy;
          if (dist2 > 5) continue;
          totalNeighbors++;
          const nPos = ny * w + nx;
          if (bgMask[nPos] === 1) {
            bgNeighbors += dist2 <= 1 ? 1.5 : 0.7;
          } else {
            const nIdx = nPos * 4;
            innerR += data[nIdx];
            innerG += data[nIdx + 1];
            innerB += data[nIdx + 2];
            innerWeight++;
          }
        }
      }

      if (bgNeighbors === 0) {
        alphaOut[pos] = data[pos * 4 + 3];
      } else {
        const bgRatio = Math.min(1, bgNeighbors / Math.max(1, totalNeighbors * 0.75));
        const softAlpha = Math.round(data[pos * 4 + 3] * (1 - bgRatio * 0.85));
        alphaOut[pos] = softAlpha;

        // Decontaminate boundary edge fringe toward neighboring inner fur tone
        if (innerWeight > 0 && softAlpha < 240) {
          const pIdx = pos * 4;
          const avgR = innerR / innerWeight;
          const avgG = innerG / innerWeight;
          const avgB = innerB / innerWeight;
          data[pIdx] = Math.round(data[pIdx] * 0.45 + avgR * 0.55);
          data[pIdx + 1] = Math.round(data[pIdx + 1] * 0.45 + avgG * 0.55);
          data[pIdx + 2] = Math.round(data[pIdx + 2] * 0.45 + avgB * 0.55);
        }
      }
    }
  }

  // Fallback safeguard: if segmentation somehow removed >94% of pixels, retain original with soft edge vignette
  const removedSomething = fgCount > totalPixels * 0.06 && fgCount < totalPixels * 0.985;
  if (removedSomething) {
    for (let i = 0; i < totalPixels; i++) {
      data[i * 4 + 3] = alphaOut[i];
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Auto-crop tightly around opaque subject pixels
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 18) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) {
    minX = 0;
    minY = 0;
    maxX = w - 1;
    maxY = h - 1;
  }

  const padX = Math.round((maxX - minX) * 0.03);
  const padY = Math.round((maxY - minY) * 0.03);
  const cropX = Math.max(0, minX - padX);
  const cropY = Math.max(0, minY - padY);
  const cropW = Math.min(w - cropX, maxX - minX + 1 + padX * 2);
  const cropH = Math.min(h - cropY, maxY - minY + 1 + padY * 2);

  const cropped = document.createElement('canvas');
  cropped.width = Math.max(1, cropW);
  cropped.height = Math.max(1, cropH);
  const cctx = cropped.getContext('2d');
  if (cctx) {
    cctx.imageSmoothingEnabled = true;
    cctx.imageSmoothingQuality = 'high';
    cctx.drawImage(work, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  }

  const result: CutoutResult = {
    canvas: cropped,
    dataUrl: cropped.toDataURL('image/png'),
    aiAssisted: Boolean(aiHint?.detected),
    hasCutout: removedSomething,
  };

  cutoutCache.set(aiKey, result);
  return result;
}
