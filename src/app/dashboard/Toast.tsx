"use client";
import { useEffect } from "react";

export default function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        background: type === "success" ? "#4caf50" : "#f44336",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        minWidth: 200,
        fontWeight: 500,
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{ marginLeft: 16, background: "transparent", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
      >
        ×
      </button>
    </div>
  );
} 