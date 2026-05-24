import { useCallback, useEffect, useRef, useState } from "react";

function DesktopWindow({
  app,
  isFocused,
  position,
  size,
  onClose,
  onFocus,
  onMove,
}) {
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleTitleMouseDown = (e) => {
    if (e.button !== 0) return;
    onFocus();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      onMove({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    },
    [isDragging, onMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={dragRef}
      className={`desktop-window ${isFocused ? "desktop-window-focused" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isFocused ? 100 : 10,
      }}
      onMouseDown={onFocus}
      role="dialog"
      aria-label={app.title}
    >
      <div
        className="desktop-window-titlebar"
        onMouseDown={handleTitleMouseDown}
      >
        <span className="desktop-window-title">{app.title}</span>
        <div className="desktop-window-controls">
          <button
            type="button"
            className="window-control window-control-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label={`Close ${app.title}`}
          />
        </div>
      </div>
      <div className="desktop-window-body">{app.content}</div>
    </div>
  );
}

export default DesktopWindow;
