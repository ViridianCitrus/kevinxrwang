import React, { useEffect, useRef, useState } from "react";
import "./Notepad.css";

function Notepad() {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("Untitled.txt");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState("Ln 1, Col 1");
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("notepad-theme") || "light"
      : "light"
  );

  useEffect(() => {
    const updateStatus = () => {
      const el = textareaRef.current;
      if (!el) return;
      const value = el.value;
      const start = el.selectionStart;
      const lines = value.slice(0, start).split("\n");
      const ln = lines.length;
      const col = lines[lines.length - 1].length + 1;
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;
      setStatus(`Ln ${ln}, Col ${col} — ${words} words`);
    };
    updateStatus();
  }, [text]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        fileInputRef.current?.click();
      } else if (e.ctrlKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        handleNew();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [text]);

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
    { id: 0, title: "Untitled", filename: "Untitled.txt", text: "" },
  ]);
  const [activeId, setActiveId] = useState(0);

  const createTab = (content = "", fname = "Untitled.txt") => {
    const id = nextTabId.current++;
    const title = fname.replace(/\.\w+$/, "") || `Untitled${id}`;
    const tab = { id, title, filename: fname, text: content };
    setTabs((t) => [...t, tab]);
    setActiveId(id);
    return id;
  };

  const closeTab = (id) => {
    setTabs((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (next.length === 0) {
        // always keep at least one
        const base = {
          id: 0,
          title: "Untitled",
          filename: "Untitled.txt",
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

  const updateActiveText = (newText) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, text: newText } : t))
    );
    setText(newText);
  };

  const handleNew = () => {
    createTab("", "Untitled.txt");
    textareaRef.current?.focus();
  };

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

  const handleSave = () => {
    const active = tabs.find((t) => t.id === activeId) || tabs[0];
    const blob = new Blob([active?.text ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = active?.filename || "Untitled.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
        <button className="tab-add" onClick={handleNew} title="New tab">
          ＋
        </button>
      </div>
      <div className="notepad-menu">
        <div className="menu-group">
          <button className="menu-label">File</button>
          <div className="menu-dropdown">
            <button onClick={handleNew}>New (Ctrl+N)</button>
            <button onClick={() => fileInputRef.current?.click()}>
              Open... (Ctrl+O)
            </button>
            <button onClick={handleSave}>Save (Ctrl+S)</button>
          </div>
        </div>
        <div className="menu-group">
          <button className="menu-label">Edit</button>
        </div>
        <div className="menu-group">
          <button className="menu-label">View</button>
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

      <textarea
        ref={textareaRef}
        className="notepad-text"
        value={tabs.find((t) => t.id === activeId)?.text ?? ""}
        onChange={(e) => updateActiveText(e.target.value)}
        spellCheck={false}
        placeholder=""
      />

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
