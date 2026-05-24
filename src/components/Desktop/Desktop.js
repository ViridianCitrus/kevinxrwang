import { useCallback, useEffect, useState } from "react";
import "./Desktop.css";
import { APPS, getAppById } from "./apps";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import Taskbar from "./Taskbar";

function formatClock(date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function Desktop() {
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [clock, setClock] = useState(() => {
    const now = new Date();
    return `${formatClock(now)}\n${formatDate(now)}`;
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(`${formatClock(now)}\n${formatDate(now)}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const openApp = useCallback((appId) => {
    const app = getAppById(appId);
    if (!app) return;

    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      if (existing) {
        setFocusedId(appId);
        return prev;
      }
      return [
        ...prev,
        {
          id: app.id,
          title: app.title,
          icon: app.icon,
          position: { ...app.defaultPosition },
          size: { ...app.defaultSize },
        },
      ];
    });
    setFocusedId(appId);
  }, []);

  const closeWindow = useCallback((appId) => {
    setOpenWindows((prev) => {
      const next = prev.filter((w) => w.id !== appId);
      setFocusedId((current) => {
        if (current !== appId) return current;
        return next.length ? next[next.length - 1].id : null;
      });
      return next;
    });
  }, []);

  const moveWindow = useCallback((appId, position) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, position } : w))
    );
  }, []);

  return (
    <div className="desktop-root">
      <div className="desktop-wallpaper" />
      <main className="desktop-surface">
        <div className="desktop-icons">
          {APPS.map((app) => (
            <DesktopIcon key={app.id} app={app} onOpen={openApp} />
          ))}
        </div>
        <div className="desktop-windows">
          {openWindows.map((win) => {
            const app = getAppById(win.id);
            if (!app) return null;
            return (
              <DesktopWindow
                key={win.id}
                app={app}
                isFocused={focusedId === win.id}
                position={win.position}
                size={win.size}
                onClose={() => closeWindow(win.id)}
                onFocus={() => setFocusedId(win.id)}
                onMove={(pos) => moveWindow(win.id, pos)}
              />
            );
          })}
        </div>
      </main>
      <Taskbar
        openWindows={openWindows}
        focusedId={focusedId}
        onFocus={setFocusedId}
        clock={clock}
      />
    </div>
  );
}

export default Desktop;
