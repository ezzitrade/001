export const metadata = { title: "Devlog" };

export default function Devlog() {
  return (
    <main className="container">
      <h1>Devlog</h1>
      <div className="card">
        <div className="pill">2025-12-14</div>
        <h2 style={{ marginTop: 10 }}>Release v1 scaffold</h2>
        <p>Next.js app + Canvas runtime + KV persistence + anti-cheese endpoints.</p>
      </div>
    </main>
  );
}
