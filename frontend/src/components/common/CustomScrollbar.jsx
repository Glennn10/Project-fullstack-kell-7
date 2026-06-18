import { useEffect, useRef, useState } from 'react';

const MIN_THUMB_HEIGHT = 38;
const MAX_THUMB_HEIGHT = 112;

const CustomScrollbar = () => {
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false });
  const dragState = useRef(null);
  const frame = useRef(null);

  const updateThumb = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const viewportHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const maxScroll = pageHeight - viewportHeight;

      if (maxScroll <= 0) {
        setThumb({ height: 0, top: 0, visible: false });
        return;
      }

      const proportionalHeight = (viewportHeight / pageHeight) * viewportHeight * 0.62;
      const height = Math.min(MAX_THUMB_HEIGHT, Math.max(MIN_THUMB_HEIGHT, proportionalHeight));
      const travel = viewportHeight - height;
      const top = (window.scrollY / maxScroll) * travel;

      setThumb({ height, top, visible: true });
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateThumb);
    resizeObserver.observe(document.documentElement);

    updateThumb();
    window.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);

    return () => {
      cancelAnimationFrame(frame.current);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
    };
  }, []);

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { pointerY: event.clientY, scrollY: window.scrollY };
  };

  const handlePointerMove = (event) => {
    if (!dragState.current) return;

    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const maxScroll = pageHeight - viewportHeight;
    const thumbTravel = viewportHeight - thumb.height;
    const pointerDelta = event.clientY - dragState.current.pointerY;

    window.scrollTo(0, dragState.current.scrollY + (pointerDelta / thumbTravel) * maxScroll);
  };

  const handlePointerUp = (event) => {
    dragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!thumb.visible) return null;

  return (
    <div
      className="custom-scrollbar-thumb"
      style={{ height: `${thumb.height}px`, transform: `translateY(${thumb.top}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-hidden="true"
    />
  );
};

export default CustomScrollbar;
