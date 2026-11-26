import { useEffect, useState } from 'react';

export function useAuthViewport() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    let frame = 0;
    const update = () => {
      const focused = document.activeElement;
      const isField = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement;
      const open = isField && window.innerHeight - viewport.height > 140;
      setKeyboardOpen(open);
      if (open) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          focused.scrollIntoView({ block: 'center', behavior: 'smooth' }),
        );
      }
    };
    viewport.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, []);
  return keyboardOpen;
}
