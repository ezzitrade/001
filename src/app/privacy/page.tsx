export const metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <main className="container">
      <h1>Privacy</h1>
      <div className="card">
        <p>We store anonymous game data (a random player id cookie and game progress) to provide persistence.</p>
        <p>We do not collect email addresses or sell personal data.</p>
      </div>
    </main>
  );
}
