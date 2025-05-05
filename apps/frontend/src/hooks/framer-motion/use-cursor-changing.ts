import type { MotionValue } from 'framer-motion';

import { useState, useEffect } from 'react';

export function useCursorState(value: MotionValue<number>) {
  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffect(() => {
    let isActive = false;

    value.on('change', (latest) => {
      const wasActive = isActive;

      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          setIsGrabbing(true);
          document.body.style.userSelect = 'none';
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          setIsGrabbing(false);
          document.body.style.userSelect = '';
        }
      }

      return () => {
        document.body.style.userSelect = '';
      };
    });
  }, [value, isGrabbing]);

  return isGrabbing;
}
