import React, { useState, useEffect, useMemo } from "react";

// Flatten JSX into an array of { text: string, elementPath: array } entries
function flattenTextNodes(children, path = []) {
  const result = [];

  React.Children.forEach(children, (child, index) => {
    const currentPath = [...path, index];

    if (child === null || child === undefined || typeof child === "boolean") {
      return; // skip
    } else if (typeof child === "string" || typeof child === "number") {
      // split string into characters and accumulate as one text node
      result.push({ text: child.toString(), path: currentPath });
    } else if (React.isValidElement(child)) {
      // recurse into children
      result.push(...flattenTextNodes(child.props.children, currentPath));
    } else {
      // other types: convert to string
      result.push({ text: String(child), path: currentPath });
    }
  });

  return result;
}

// Given original JSX, reveal text content up to charIndex globally
function revealTextInTree(children, flattenedTextNodes, charIndex, path = []) {
  let charsConsumed = 0;

  // Helper to reveal text in strings
  function revealText(text) {
    if (charsConsumed + text.length <= charIndex) {
      // reveal entire string
      charsConsumed += text.length;
      return text;
    } else if (charsConsumed >= charIndex) {
      // reveal nothing here yet
      return "";
    } else {
      // partially reveal
      const remain = charIndex - charsConsumed;
      charsConsumed += remain;
      return text.slice(0, remain);
    }
  }

  // Recursive function to rebuild JSX with partial reveal
  function recursiveBuild(node, currentPath = []) {
    if (node === null || node === undefined || typeof node === "boolean") {
      return null;
    } else if (typeof node === "string" || typeof node === "number") {
      // This is a text node
      return revealText(node.toString());
    } else if (React.isValidElement(node)) {
      // Recurse children
      const children = node.props.children;
      let newChildren = null;

      if (children) {
        if (Array.isArray(children)) {
          newChildren = children.map((c, i) =>
            recursiveBuild(c, [...currentPath, i])
          );
        } else {
          newChildren = recursiveBuild(children, [...currentPath, 0]);
        }
      }

      return React.cloneElement(node, { ...node.props }, newChildren);
    } else {
      // Other node types, render as string partially revealed
      return revealText(String(node));
    }
  }

  return recursiveBuild(children);
}

function TypingNotepad({ content }) {
  // Flatten text nodes once per content change
  const flattenedTextNodes = useMemo(
    () => flattenTextNodes(content),
    [content]
  );

  // Calculate total text length
  const totalLength = flattenedTextNodes.reduce(
    (sum, node) => sum + node.text.length,
    0
  );

  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setCharIndex(0);
  }, [content]);

  useEffect(() => {
    if (charIndex >= totalLength) return;

    const timeout = setTimeout(() => {
      setCharIndex((ci) => ci + 1);
    }, 1); // speed in ms per character

    return () => clearTimeout(timeout);
  }, [charIndex, totalLength]);

  // Build the JSX tree revealing only up to charIndex chars
  const displayedContent = useMemo(() => {
    return revealTextInTree(content, flattenedTextNodes, charIndex);
  }, [content, flattenedTextNodes, charIndex]);

  return (
    <pre
      className="notepad-content"
      style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}
    >
      {displayedContent}
    </pre>
  );
}

export default TypingNotepad;
