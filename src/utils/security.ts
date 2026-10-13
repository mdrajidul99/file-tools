/**
 * Client-Side Source Code Protection & Anti-Inspection Utility
 *
 * Implements security hardening to prevent unauthorized viewing, scraping,
 * or copying of frontend source code and intellectual property:
 *
 * 1. Blocks Developer Tools inspection shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
 * 2. Blocks Source Code inspection shortcuts (Ctrl+U / Cmd+Opt+U, Ctrl+S / Cmd+S)
 * 3. Blocks right-click context menu (Inspect Element / View Source) on page elements,
 *    while allowing standard interaction in text inputs and textareas
 * 4. Prevents dragging of sensitive branding and image assets
 * 5. Clears console and issues authoritative security warning upon console access
 */

export function initClientSecurity(): void {
  if (typeof window === 'undefined') return;

  // 1. Keyboard Shortcut Blocker
  window.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key;
      const keyCode = event.keyCode;
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isAlt = event.altKey;

      // F12 -> DevTools
      if (key === 'F12' || keyCode === 123) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Ctrl + Shift + I / Cmd + Option + I -> Inspect
      if (isCtrlOrMeta && (isShift || isAlt) && (key === 'I' || key === 'i' || keyCode === 73)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Ctrl + Shift + J / Cmd + Option + J -> Console
      if (isCtrlOrMeta && (isShift || isAlt) && (key === 'J' || key === 'j' || keyCode === 74)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Ctrl + Shift + C / Cmd + Option + C -> Inspect Element selector
      if (isCtrlOrMeta && (isShift || isAlt) && (key === 'C' || key === 'c' || keyCode === 67)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Ctrl + U / Cmd + Option + U -> View Source
      if ((isCtrlOrMeta || isAlt) && (key === 'U' || key === 'u' || keyCode === 85)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Ctrl + S / Cmd + S -> Save Page as HTML/JS bundle
      if (isCtrlOrMeta && (key === 'S' || key === 's' || keyCode === 83)) {
        const target = event.target as HTMLElement | null;
        if (!target || !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
    },
    { capture: true }
  );

  // 2. Right-Click Context Menu Prevention
  window.addEventListener(
    'contextmenu',
    (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      // Allow context menu only inside inputs or textareas so users can paste or spellcheck
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true }
  );

  // 3. Prevent dragging images and logo out of the page
  window.addEventListener(
    'dragstart',
    (event: DragEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.tagName === 'IMG') {
        event.preventDefault();
      }
    },
    { capture: true }
  );

  // 4. Console Security Notice
  try {
    const bannerStyle =
      'color: #ef4444; font-size: 22px; font-weight: 800; padding: 4px;';
    const textStyle = 'color: #6366f1; font-size: 13px; font-weight: 600; padding: 2px;';
    console.clear();
    console.log('%c⚠️ SECURITY NOTICE: SOURCE CODE PROTECTED', bannerStyle);
    console.log(
      '%cFile Tools is protected by intellectual property safeguards. Unauthorized extraction, copying, or reverse-engineering of this application is strictly restricted.',
      textStyle
    );
  } catch {
    // Ignore any console restrictions
  }
}
