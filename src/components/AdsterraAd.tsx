import React from 'react';

interface AdsterraAdProps {
  className?: string;
  slot?: 'auto' | 'banner' | 'mobile';
}

export const AdsterraAd: React.FC<AdsterraAdProps> = ({ className = '', slot = 'auto' }) => {
  // Mobile banner srcdoc (320x50)
  const mobileSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
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
    </html>
  `;

  // Desktop banner srcdoc (728x90)
  const desktopSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
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
    </html>
  `;

  return (
    <div
      className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 p-2 text-center dark:border-slate-800/80 dark:bg-slate-900/40 ${className}`}
      aria-label="Sponsored advertisement"
    >
      <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Advertisement
      </span>

      {/* Desktop Banner: 728x90 (shown on md: screens and above) */}
      {(slot === 'auto' || slot === 'banner') && (
        <div className="hidden w-full max-w-[728px] overflow-hidden md:flex md:justify-center">
          <iframe
            title="Adsterra 728x90 Banner"
            srcDoc={desktopSrcDoc}
            width="728"
            height="90"
            className="border-0 overflow-hidden"
            loading="lazy"
          />
        </div>
      )}

      {/* Mobile Banner: 320x50 (shown on screens smaller than md) */}
      {(slot === 'auto' || slot === 'mobile') && (
        <div className="flex w-full max-w-[320px] justify-center overflow-hidden md:hidden">
          <iframe
            title="Adsterra 320x50 Mobile Banner"
            srcDoc={mobileSrcDoc}
            width="320"
            height="50"
            className="border-0 overflow-hidden"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};
