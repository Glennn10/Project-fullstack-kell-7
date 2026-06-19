import { useRef, useState } from 'react';

export const useBookCarousel = (stopsCount) => {
  const [position, setPosition] = useState(0);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const blockClickRef = useRef(false);

  const moveTo = (nextPosition) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    if (stopsCount <= 1) {
      viewport.scrollTo({ left: 0, behavior: 'smooth' });
      setPosition(0);
      return;
    }

    const boundedPosition = Math.min(stopsCount - 1, Math.max(0, nextPosition));
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollTo({ left: maxScroll * (boundedPosition / (stopsCount - 1)), behavior: 'smooth' });
    setPosition(boundedPosition);
  };

  const syncPosition = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    if (maxScroll > 0 && stopsCount > 1) setPosition(Math.round((viewport.scrollLeft / maxScroll) * (stopsCount - 1)));
  };

  const startDrag = (event) => {
    dragRef.current = { pointerX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event) => {
    if (!dragRef.current) return;
    const distance = event.clientX - dragRef.current.pointerX;
    if (Math.abs(distance) > 4) dragRef.current.moved = true;
    event.currentTarget.scrollLeft = dragRef.current.scrollLeft - distance;
  };

  const stopDrag = (event) => {
    if (!dragRef.current) return;
    blockClickRef.current = dragRef.current.moved;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setTimeout(() => { blockClickRef.current = false; }, 0);
  };

  const blockClickAfterDrag = (event) => {
    if (blockClickRef.current) event.preventDefault();
  };

  return { position, viewportRef, moveTo, syncPosition, startDrag, drag, stopDrag, blockClickAfterDrag };
};
