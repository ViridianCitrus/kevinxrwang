import { useEffect, useRef, useState, useCallback } from "react";
import "./Notepad.css";
import TypingNotepad from "./TypingNotepad";
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
  const [filename, setFilename] = useState("kevinwang.txt");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState("Ln 1, Col 1");
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

  // update status (Ln/Col/words) based on textarea events and selection
  useEffect(() => {
    const updateStatus = () => {
      const el = textareaRef.current;
      if (!el) return;
      const value = el.value || "";
      const start = el.selectionStart ?? 0;
      const lines = value.slice(0, start).split("\n");
      const ln = lines.length;
      const col = lines[lines.length - 1].length + 1;
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setStatus(`Ln ${ln}, Col ${col} — ${words} words`);
    };

    const el = textareaRef.current;
    updateStatus();
    if (el) {
      el.addEventListener("input", updateStatus);
      el.addEventListener("click", updateStatus);
      el.addEventListener("keyup", updateStatus);
      el.addEventListener("mouseup", updateStatus);
    }
    return () => {
      if (el) {
        el.removeEventListener("input", updateStatus);
        el.removeEventListener("click", updateStatus);
        el.removeEventListener("keyup", updateStatus);
        el.removeEventListener("mouseup", updateStatus);
      }
    };
  }, [activeId]);

  // keep displayed filename in sync when active tab changes
  useEffect(() => {
    const active = tabs.find((t) => t.id === activeId) || tabs[0];
    if (!active) return;
    setFilename(active.filename || active.title || "");
    // trigger status update
    const el = textareaRef.current;
    if (el) {
      const event = new Event("input", { bubbles: true });
      el.dispatchEvent(event);
    }
  }, [activeId, tabs]);

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
          text: "",
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

  const getRouteFromFilename = (filename) => {
    if (!filename) return "/";
    const lower = filename.toLowerCase();
    if (lower === "projects.txt" || lower === "projects") return "/projects";
    if (lower === "resume.txt" || lower === "resume") return "/resume";
    if (lower === "kevinwang.txt" || lower === "kevinwang") return "/";
    // fallback: map filename to a file route
    return `/file/${encodeURIComponent(filename.replace(/\.[^/.]+$/, ""))}`;
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

  return (
    <div className={`notepad-root ${theme === "dark" ? "dark" : ""}`}>
      <div className="notepad-tabs">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`notepad-tab ${t.id === activeId ? "tab-active" : ""}`}
            onClick={() => selectTab(t.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && selectTab(t.id)}
          >
            <span className="tab-title">{t.title}</span>
            <button
              className="tab-close"
              onClick={(ev) => {
                ev.stopPropagation();
                closeTab(t.id);
              }}
              aria-label="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="notepad-menu">
        <div className="menu-group">
          <button
            className={`menu-label ${isHomeActive ? "menu-active" : ""}`}
            onClick={() => openOrActivateTab("kevinwang.txt", "/")}
          >
            Home
          </button>
        </div>
        <div className="menu-group">
          <button
            className={`menu-label ${isProjectsActive ? "menu-active" : ""}`}
            onClick={() => openOrActivateTab("Projects.txt", "/projects")}
          >
            Projects
          </button>
        </div>
        <div className="menu-group">
          <button
            className={`menu-label ${isResumeActive ? "menu-active" : ""}`}
            onClick={() => openOrActivateTab("Resume.txt", "/resume")}
          >
            Resume
          </button>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.04 1.05l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 13h3v-2h-3v2zM12 7a5 5 0 100 10 5 5 0 000-10zm4.24 11.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM12 23h2v-3h-2v3zM4.93 19.07l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="notepad-text notepad-content">
        <TypingNotepad
          content={tabs.find((t) => t.id === activeId)?.text || ""}
        />
      </div>

      <div className="notepad-status">
        {filename} — {status}
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
