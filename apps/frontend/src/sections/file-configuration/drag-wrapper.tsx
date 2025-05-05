import type { PanInfo } from 'framer-motion';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface DragElementProps {
  columnRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  move: (nextColumn: string) => void;
}

export const DragElement = ({ children, columnRef, move }: DragElementProps) => {
  const [drag, setDrag] = useState(true);
  const [captured, setCaptured] = useState(false);

  const column = useRef<HTMLDivElement | null>(null);
  const lastColumn = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (columnRef.current) {
      column.current = columnRef.current;
      lastColumn.current = columnRef.current;
    }
  }, [columnRef]);

  const onDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const columns = document.querySelectorAll('.board-column');

    Array.from(columns).forEach((block) => {
      const rect = block.getBoundingClientRect();

      const { scrollY } = window;

      const isInside =
        info.point.x >= rect.left &&
        info.point.x <= rect.right &&
        info.point.y >= rect.top + scrollY &&
        info.point.y <= rect.bottom + scrollY;

      if (isInside) {
        if (column.current !== block) {
          column.current = block as HTMLDivElement;
        }
      }
    });
  };

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (column.current && lastColumn && column.current !== lastColumn.current) {
      move(column.current.id);
      lastColumn.current = column.current;
    }
  };

  return (
    <motion.div
      drag={drag}
      dragConstraints={columnRef}
      dragElastic={1}
      dragMomentum={false}
      dragSnapToOrigin={column.current?.id === lastColumn.current?.id}
      whileTap={{ cursor: 'grabbing' }}
      style={{ cursor: 'grab' }}
      onMouseDownCapture={() => setCaptured(true)}
      onMouseUpCapture={() => setCaptured(false)}
      onMouseEnter={() => setDrag(true)}
      onMouseLeave={() => {
        if (!captured) setDrag(false);
      }}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      dragTransition={{ bounceStiffness: 1000, bounceDamping: 100 }}
    >
      {children}
    </motion.div>
  );
};
