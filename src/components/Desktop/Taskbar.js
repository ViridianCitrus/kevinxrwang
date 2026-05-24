function Taskbar({ openWindows, focusedId, onFocus, clock }) {
  return (
    <footer className="taskbar">
      <button type="button" className="taskbar-start" aria-label="Start">
        <span className="taskbar-start-icon" />
      </button>
      <div className="taskbar-windows">
        {openWindows.map((win) => (
          <button
            key={win.id}
            type="button"
            className={`taskbar-window-btn ${
              focusedId === win.id ? "taskbar-window-active" : ""
            }`}
            onClick={() => onFocus(win.id)}
          >
            <span className={`taskbar-app-icon taskbar-icon-${win.icon}`} />
            <span className="taskbar-window-label">{win.title}</span>
          </button>
        ))}
      </div>
      <div className="taskbar-tray">
        <time className="taskbar-clock">{clock}</time>
      </div>
    </footer>
  );
}

export default Taskbar;
