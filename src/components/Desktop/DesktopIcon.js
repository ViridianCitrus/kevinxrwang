function DesktopIcon({ app, onOpen }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(app.id);
    }
  };

  return (
    <button
      type="button"
      className="desktop-icon"
      onClick={() => onOpen(app.id)}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${app.title}`}
    >
      <span className={`desktop-icon-graphic desktop-icon-${app.icon}`} />
      <span className="desktop-icon-label">{app.title}</span>
    </button>
  );
}

export default DesktopIcon;
