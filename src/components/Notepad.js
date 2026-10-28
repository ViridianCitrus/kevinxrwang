import { useEffect, useRef, useState, useCallback } from "react";
import "./Notepad.css";
import TypingNotepad, { countCharacters } from "./TypingNotepad";
import homeContent from "../pages/home";
import projectsContent from "../pages/projects";
import resumeContent from "../pages/resume";

const getTitleFromFilename = (fname) => {
  if (!fname) return "";
  const base = fname.replace(/\.[^/.]+$/, "");
  const key = base.toLowerCase();
  if (key.includes("kevinwang")) return "Kevin Wang";
  if (key.includes("projects")) return "Projects";
  if (key.includes("resume")) return "Resume";
  return base
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

function Notepad() {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [maximized, setMaximized] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("notepad-theme") || "light"
      : "light"
  );

  useEffect(() => {
    try {
      localStorage.setItem("notepad-theme", theme);
    } catch (e) {}
    if (theme === "dark") {
      document.documentElement?.setAttribute("data-theme", "dark");
    } else {
      document.documentElement?.setAttribute("data-theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Tabs state: each tab { id, title, filename, text }
  const nextTabId = useRef(1);
  const [tabs, setTabs] = useState(() => [
    {
      id: 0,
      title: "Kevin Wang",
      filename: "kevinwang.txt",
      text: homeContent,
    },
  ]);
  const [activeId, setActiveId] = useState(0);

  // refs to hold latest tabs/activeId for global handlers to avoid stale closures
  const activeIdRef = useRef(activeId);
  const tabsRef = useRef(tabs);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  const createTab = useCallback(
    (content = "", fname = "kevinwang.txt") => {
      const normalized = (fname || "").trim().toLowerCase();
      let existingId = null;
      setTabs((prev) => {
        const found = prev.find(
          (t) => (t.filename || "").toLowerCase() === normalized
        );
        if (found) {
          existingId = found.id;
          return prev;
        }
        const id = nextTabId.current++;
        const title = getTitleFromFilename(fname) || `Untitled${id}`;
        const tab = { id, title, filename: fname, text: content };
        return [...prev, tab];
      });

      if (existingId !== null) {
        setActiveId(existingId);
        return existingId;
      }

      const newId = nextTabId.current - 1;
      setActiveId(newId);
      return newId;
    },
    [setTabs, setActiveId]
  );

  const openOrActivateTab = (fname, route) => {
    const normalized = (fname || "").toLowerCase();
    const existing = tabs.find(
      (t) => (t.filename || "").toLowerCase() === normalized
    );
    if (existing) {
      setActiveId(existing.id);
    } else {
      const id = nextTabId.current++;
      const title = getTitleFromFilename(fname) || `Untitled${id}`;
      // choose initial content for special tabs
      let initialText = "";
      if (normalized.includes("kevinwang") || normalized.includes("home")) {
        initialText = homeContent;
      } else if (normalized.includes("projects")) {
        initialText = projectsContent;
      } else if (normalized.includes("resume")) {
        initialText = resumeContent;
      }
      const tab = { id, title, filename: fname, text: initialText };
      setTabs((prev) => [...prev, tab]);
      setActiveId(id);
    }

    try {
      window.history.pushState({}, "", route);
    } catch (e) {
      window.location.href = route;
    }
  };
  const closeTab = (id) => {
    setTabs((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (next.length === 0) {
        // always keep at least one
        const base = {
          id: 0,
          title: "Kevin Wang",
          filename: "kevinwang.txt",
          text: homeContent,
        };
        setActiveId(0);
        nextTabId.current = Math.max(nextTabId.current, 1);
        return [base];
      }
      if (activeId === id) {
        const idx = prev.findIndex((p) => p.id === id);
        const pick = prev[idx + 1] || prev[idx - 1] || next[0];
        setActiveId(pick.id);
      }
      return next;
    });
  };

  const selectTab = (id) => setActiveId(id);

  const BASE = "/kevinxrwang";
  const getRouteFromFilename = (filename) => {
    if (!filename) return BASE;
    const lower = filename.toLowerCase();
    if (lower === "projects.txt" || lower === "projects")
      return `${BASE}/projects`;
    if (lower === "resume.txt" || lower === "resume") return `${BASE}/resume`;
    if (lower === "kevinwang.txt" || lower === "kevinwang") return BASE;
    // fallback: map filename to a file route
    return `${BASE}/file/${encodeURIComponent(
      filename.replace(/\.[^/.]+$/, "")
    )}`;
  };

  // keep URL in sync with the active tab
  useEffect(() => {
    const active = tabs.find((t) => t.id === activeId) || tabs[0];
    if (!active) return;
    const route = getRouteFromFilename(active.filename || active.title);
    try {
      if (window && window.history && window.location.pathname !== route) {
        window.history.pushState({}, "", route);
      }
    } catch (e) {
      // ignore
    }
  }, [activeId, tabs]);

  // derive which top-level menu should be highlighted based on active tab
  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];
  const activeFilename = (
    activeTab?.filename ||
    activeTab?.title ||
    ""
  ).toLowerCase();
  const isHomeActive =
    activeFilename.includes("kevinwang") || activeFilename.includes("home");
  const isProjectsActive = activeFilename.includes("projects");
  const isResumeActive = activeFilename.includes("resume");

  // global keyboard shortcuts — use refs to access latest tabs/active state
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        const active =
          (tabsRef.current || []).find((t) => t.id === activeIdRef.current) ||
          (tabsRef.current || [])[0];
        const blob = new Blob([active?.text ?? ""], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = active?.filename || "kevinwang.txt";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else if (e.ctrlKey && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        fileInputRef.current?.click();
      } else if (e.ctrlKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        createTab("", "kevinwang.txt");
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createTab]);

  // editing disabled: tabs hold text content; no onChange handler required

  const handleOpen = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      createTab(e.target.result, file.name);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleOpen(file);
    e.target.value = "";
  };

  const charCount = countCharacters(activeTab?.text);

  const menuItems = [
    { label: "Home", file: "kevinwang.txt", route: BASE, active: isHomeActive },
    {
      label: "Projects",
      file: "Projects.txt",
      route: `${BASE}/projects`,
      active: isProjectsActive,
    },
    {
      label: "Resume",
      file: "Resume.txt",
      route: `${BASE}/resume`,
      active: isResumeActive,
    },
  ];

  return (
    <div
      className={`notepad-root ${theme === "dark" ? "dark" : ""} ${
        maximized ? "maximized" : ""
      }`}
    >
      <div className="notepad-titlebar">
        <svg
          className="app-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden
        >
          <rect x="2" y="1.5" width="12" height="13" rx="2" fill="#fff" />
          <rect x="2" y="1.5" width="12" height="13" rx="2" fill="none" stroke="#7a7a7a" />
          <path d="M2.5 4.5h11V3.5a1.5 1.5 0 00-1.5-1.5H4a1.5 1.5 0 00-1.5 1.5z" fill="#2f8fdf" />
          <path d="M4.5 7.5h7M4.5 9.75h7M4.5 12h4.5" stroke="#9a9a9a" strokeLinecap="round" />
        </svg>

        <div className="notepad-tabs" role="tablist">
          {tabs.map((t) => (
            <div
              key={t.id}
              className={`notepad-tab ${t.id === activeId ? "tab-active" : ""}`}
              onClick={() => selectTab(t.id)}
              role="tab"
              aria-selected={t.id === activeId}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && selectTab(t.id)}
              title={t.filename || t.title}
            >
              <span className="tab-title">{t.filename || t.title}</span>
              <button
                className="tab-close"
                onClick={(ev) => {
                  ev.stopPropagation();
                  closeTab(t.id);
                }}
                aria-label={`Close ${t.filename || t.title}`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>
          ))}
          <button
            className="tab-add"
            onClick={() => createTab("", "Untitled")}
            aria-label="New tab"
            title="New tab (Ctrl+N)"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        <div className="window-controls">
          <span className="window-control" aria-hidden>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
          <button
            className="window-control"
            onClick={() => setMaximized((m) => !m)}
            aria-label={maximized ? "Restore" : "Maximize"}
            title={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <rect x="0.5" y="2.5" width="7" height="7" rx="1" fill="none" stroke="currentColor" />
                <path d="M2.5 2.5V1.5a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-1" fill="none" stroke="currentColor" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <rect x="0.5" y="0.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" />
              </svg>
            )}
          </button>
          <span className="window-control window-close" aria-hidden>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        </div>
      </div>

      <div className="notepad-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`menu-label ${item.active ? "menu-active" : ""}`}
            onClick={() => openOrActivateTab(item.file, item.route)}
          >
            {item.label}
          </button>
        ))}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.41 1.41M17.31 17.31l1.41 1.41M5.28 18.72l1.41-1.41M17.31 6.69l1.41-1.41"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="notepad-text notepad-content">
        <TypingNotepad content={activeTab?.text || ""} />
      </div>

      <div className="notepad-status">
        <span className="status-item">Ln 1, Col 1</span>
        <span className="status-item">
          {charCount.toLocaleString()} characters
        </span>
        <span className="status-spacer" />
        <span className="status-item status-optional">100%</span>
        <span className="status-item status-optional">Windows (CRLF)</span>
        <span className="status-item status-optional">UTF-8</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
        accept=".txt,text/plain"
      />
    </div>
  );
}

export default Notepad;
