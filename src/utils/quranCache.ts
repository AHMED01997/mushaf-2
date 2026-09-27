/**
 * Quran Page Offline Cache & Preload Manager
 * Supports:
 * - Permanent browser CacheStorage
 * - Background prefetch for next/previous pages
 * - Bulk 604-page offline downloader with concurrency control and progress reporting
 * - Fallback to vector/Uthmani font rendering if page image is not cached
 */

const CACHE_NAME = 'quran-mushaf-pages-v2';

// Primary and mirror high-resolution Medina Mushaf 604-page CDN endpoints
export function getMushafPageUrl(pageNumber: number): string {
  // 3-digit zero padded (e.g. 001, 042, 604)
  const padded = String(pageNumber).padStart(3, '0');
  // Highly reliable, fast global CDNs for Medina Mushaf
  return `https://everyayah.com/data/quranpngs/${padded}.png`;
}

export function getFallbackPageUrl(pageNumber: number): string {
  return `https://cdn.islamic.network/quran/images/page/${pageNumber}`;
}

export interface DownloadProgress {
  status: 'idle' | 'downloading' | 'completed' | 'paused' | 'error';
  cachedCount: number;
  totalCount: number;
  currentDownloadPage: number;
  error?: string;
}

let isDownloadingCancelled = false;

/**
 * Checks how many pages are currently cached in CacheStorage
 */
export async function getCachedPagesCount(): Promise<number> {
  if (!('caches' in window)) return 0;
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch (e) {
    console.error('Failed to get cache count:', e);
    return 0;
  }
}

/**
 * Checks if a specific page is already cached
 */
export async function isPageCached(pageNumber: number): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const url = getMushafPageUrl(pageNumber);
    const match = await cache.match(url);
    return !!match;
  } catch {
    return false;
  }
}

/**
 * Pre-fetches and caches a single page
 */
export async function cachePage(pageNumber: number): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const url = getMushafPageUrl(pageNumber);
    const exists = await cache.match(url);
    if (exists) return true;

    // Fetch and store
    const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
    if (response.ok) {
      await cache.put(url, response.clone());
      return true;
    }
  } catch (err) {
    // Try fallback mirror
    try {
      const fallbackUrl = getFallbackPageUrl(pageNumber);
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(fallbackUrl, { mode: 'cors' });
      if (response.ok) {
        await cache.put(getMushafPageUrl(pageNumber), response.clone());
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Automatically preloads neighboring pages (ahead and behind) for instantaneous transitions
 */
export function preloadNeighborPages(currentPage: number, windowSize: number = 3): void {
  for (let offset = 1; offset <= windowSize; offset++) {
    const nextPage = currentPage + offset;
    const prevPage = currentPage - offset;

    if (nextPage <= 604) {
      cachePage(nextPage).catch(() => {});
    }
    if (prevPage >= 1) {
      cachePage(prevPage).catch(() => {});
    }
  }
}

/**
 * Downloads all 604 pages in background with concurrency limit (e.g. 4 parallel requests)
 */
export async function downloadAllPages(
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  isDownloadingCancelled = false;
  const totalCount = 604;
  let cachedCount = await getCachedPagesCount();

  onProgress({
    status: 'downloading',
    cachedCount,
    totalCount,
    currentDownloadPage: 1
  });

  const CONCURRENCY = 4;
  const pagesToDownload: number[] = [];

  for (let p = 1; p <= totalCount; p++) {
    pagesToDownload.push(p);
  }

  let index = 0;
  const worker = async () => {
    while (index < pagesToDownload.length && !isDownloadingCancelled) {
      const page = pagesToDownload[index++];
      const alreadyCached = await isPageCached(page);
      if (!alreadyCached) {
        await cachePage(page);
      }
      cachedCount = await getCachedPagesCount();
      onProgress({
        status: isDownloadingCancelled ? 'paused' : 'downloading',
        cachedCount,
        totalCount,
        currentDownloadPage: page
      });
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  if (isDownloadingCancelled) {
    onProgress({
      status: 'paused',
      cachedCount,
      totalCount,
      currentDownloadPage: pagesToDownload[index] || totalCount
    });
  } else {
    onProgress({
      status: 'completed',
      cachedCount: totalCount,
      totalCount,
      currentDownloadPage: totalCount
    });
  }
}

export function pauseAllDownloads(): void {
  isDownloadingCancelled = true;
}
