"use client";

/**
 * The last line of defence: the root layout itself failed, so there is no
 * stylesheet, font or masthead to lean on. Inline styles only, and it must
 * render its own <html> and <body>.
 */
export default function GlobalError({ reset }) {
  return (
    <html lang="en-NG">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#1c1512",
          color: "#fff",
          fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <p style={{ color: "#f8a840", fontWeight: 600, margin: 0 }}>Power In The Streets</p>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: "16px 0 0" }}>
            The site is having a moment.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginTop: 16 }}>
            Something went wrong on our side. Please try again shortly.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "14px 28px",
              borderRadius: 999,
              border: 0,
              background: "#ce2515",
              color: "#fff",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
