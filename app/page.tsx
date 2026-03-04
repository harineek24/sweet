import Link from "next/link";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="home-emoji-ring">
          <span className="home-orbit" style={{ "--i": 0 } as React.CSSProperties}>🍭</span>
          <span className="home-orbit" style={{ "--i": 1 } as React.CSSProperties}>🌹</span>
          <span className="home-orbit" style={{ "--i": 2 } as React.CSSProperties}>💖</span>
          <span className="home-orbit" style={{ "--i": 3 } as React.CSSProperties}>🍫</span>
          <span className="home-orbit" style={{ "--i": 4 } as React.CSSProperties}>🌻</span>
          <span className="home-orbit" style={{ "--i": 5 } as React.CSSProperties}>💝</span>
          <span className="home-center-emoji">🎁</span>
        </div>
        <h1 className="home-title">SweetBox</h1>
        <p className="home-tagline">beautiful gifts, delivered digitally</p>
        <div className="home-actions">
          <Link href="/sweets" className="home-cta">
            Build a Gift Box
          </Link>
        </div>
      </div>
    </div>
  );
}
