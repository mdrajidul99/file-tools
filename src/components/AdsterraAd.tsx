import React from 'react';

// Exact first Adsterra Code: 320 × 50 (Mobile / Compact Banner)
const mobileSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=320, initial-scale=1">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { margin: 0; padding: 0; width: 320px; height: 50px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '9c9b38397d3cbd0116d4ae1aedbd6ed4',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/9c9b38397d3cbd0116d4ae1aedbd6ed4/invoke.js"></script>
  </body>
</html>`;

// Exact second Adsterra Code: 728 × 90 (Desktop / Leaderboard Banner)
const desktopSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=728, initial-scale=1">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { margin: 0; padding: 0; width: 728px; height: 90px; overflow: hidden; background: transparent; display: flex; align-items: center; justify-content: center; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '8c0f431c498330cfdcd25eac48ec9a26',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/8c0f431c498330cfdcd25eac48ec9a26/invoke.js"></script>
  </body>
</html>`;

/**
 * Adsterra Slot 1: 320 × 50 (Mobile / Compact Placement)
 * Uses the exact first Adsterra code (key: 9c9b38397d3cbd0116d4ae1aedbd6ed4)
 */
export const AdsterraSlot1: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-1 text-center dark:border-slate-800/80 dark:bg-slate-900/40 ${className}`}
      aria-label="Advertisement Slot 1 (320x50)"
    >
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Advertisement
      </span>
      <div className="flex w-full justify-center overflow-x-auto">
        <div style={{ width: '320px', height: '50px', minWidth: '320px', minHeight: '50px' }}>
          <iframe
            title="Adsterra 320x50 Banner"
            srcDoc={mobileSrcDoc}
            src="./ad-320x50.html"
            width="320"
            height="50"
            scrolling="no"
            style={{ width: '320px', height: '50px', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Adsterra Slot 2: 728 × 90 (Desktop / Leaderboard Placement)
 * Uses the exact second Adsterra code (key: 8c0f431c498330cfdcd25eac48ec9a26)
 */
export const AdsterraSlot2: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-2 text-center dark:border-slate-800/80 dark:bg-slate-900/40 ${className}`}
      aria-label="Advertisement Slot 2 (728x90)"
    >
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Advertisement
      </span>
      <div className="flex w-full max-w-[728px] justify-center overflow-x-auto">
        <div style={{ width: '728px', height: '90px', minWidth: '728px', minHeight: '90px' }}>
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={desktopSrcDoc}
            src="./ad-728x90.html"
            width="728"
            height="90"
            scrolling="no"
            style={{ width: '728px', height: '90px', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};

interface AdsterraAdProps {
  className?: string;
  slot?: 'auto' | 'banner' | '1' | '2' | 'mobile';
}

/**
 * Responsive Adsterra Wrapper:
 * - slot="1" or "mobile" -> Displays Slot 1 (320x50)
 * - slot="2" -> Displays Slot 2 (728x90)
 * - slot="banner" or "auto" -> Responsive placement:
 *     - On Desktop (>= 768px): Displays Slot 2 (728x90)
 *     - On Mobile (< 768px): Displays Slot 1 (320x50)
 */
export const AdsterraAd: React.FC<AdsterraAdProps> = ({ className = '', slot = 'auto' }) => {
  if (slot === '1' || slot === 'mobile') {
    return <AdsterraSlot1 className={className} />;
  }

  if (slot === '2') {
    return <AdsterraSlot2 className={className} />;
  }

  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-1 sm:px-2 text-center dark:border-slate-800/80 dark:bg-slate-900/40 ${className}`}
      aria-label="Advertisement"
    >
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Advertisement
      </span>

      {/* Desktop View (md and above): 728x90 Banner */}
      <div className="hidden w-full max-w-[728px] md:flex md:justify-center overflow-x-auto">
        <div style={{ width: '728px', height: '90px', minWidth: '728px', minHeight: '90px' }}>
          <iframe
            title="Adsterra 728x90 Desktop Banner"
            srcDoc={desktopSrcDoc}
            src="./ad-728x90.html"
            width="728"
            height="90"
            scrolling="no"
            style={{ width: '728px', height: '90px', border: 'none', display: 'block' }}
          />
        </div>
      </div>

      {/* Mobile View (below md): 320x50 Banner */}
      <div className="flex w-full justify-center md:hidden overflow-x-auto">
        <div style={{ width: '320px', height: '50px', minWidth: '320px', minHeight: '50px' }}>
          <iframe
            title="Adsterra 320x50 Mobile Banner"
            srcDoc={mobileSrcDoc}
            src="./ad-320x50.html"
            width="320"
            height="50"
            scrolling="no"
            style={{ width: '320px', height: '50px', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};
