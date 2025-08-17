import React, { useState, useEffect, useRef } from "react";
import "./TracingLoader.css";

const logLines = [
  "Initializing scanner...",
  "Establishing connection...",
  "Encrypting handshake...",
  "Pinging host...",
  "Tracing route...",
  "Bypassing firewalls...",
  "Locating IP...",
  "Gathering geolocation...",
  "Decoding response...",
  "Finalizing trace...",
];

const TracingLoader = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lineIndex < logLines.length) {
        setVisibleLines((prev) => [...prev, logLines[lineIndex]]);
        setLineIndex((prev) => prev + 1);
      }
    }, 600); // slower animation
    return () => clearInterval(interval);
  }, [lineIndex]);

  // Auto scroll to bottom when new line added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="movie-loader-overlay">
      <div className="grid-bg"></div>
      <div className="scanner"></div>
      <div className="loading-text">
        TRACING IP<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
      </div>
      <div className="terminal-log" ref={terminalRef}>
  {visibleLines.map((line, index) => (
    <div
      key={index}
      className={`log-line ${index === visibleLines.length - 1 ? "typing" : ""}`}
    >
      {line}
    </div>
  ))}
</div>

    </div>
  );
};

export default TracingLoader;
