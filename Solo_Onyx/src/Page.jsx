import { Link } from 'react-router-dom';

// Placeholder page. Replace with your real pages.
export default function Page({ title }) {
  return (
    <main className="page">
      <h1>{title}</h1>
      <p>This is a placeholder route. Replace this component with your real page.</p>
      <Link to="/">← Back to the sphere</Link>
    </main>
  );
}
