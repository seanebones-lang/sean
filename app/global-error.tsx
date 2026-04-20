"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          background: "#050607",
          color: "#f4f5f6",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Something broke</h1>
          <p style={{ marginTop: 12, color: "#b0b6c2" }}>
            An unexpected error occurred. Please reload the page or try again shortly.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid #21c7ff",
              color: "#21c7ff",
              textDecoration: "none",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Return home
          </a>
        </div>
      </body>
    </html>
  );
}
