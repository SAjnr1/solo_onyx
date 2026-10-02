import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ParticleMorph from './Component/particle-morph/ParticleMorph.jsx';
import Page from './Page.jsx';
import Contact from './Component/Contact/Contact.jsx'
import Capabilities from './Component/Capabilities/Capabilities.jsx'
import Work from './Component/Work/Work.jsx';

// Start every route at the top of the page.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Home() {
  const navigate = useNavigate();
  // Clicking a 3D card calls navigate('/about') etc. (client-side, no page reload)
  return <ParticleMorph onNavigate={navigate} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Page title="About Onyx" />} />
        <Route path="/capabilities" element={<Capabilities title="Capabilities" />} />
        <Route path="/work" element={<Work title="Selected Work" />} />
        <Route path="/contact" element={<Contact title="Get in Touch" />} />
        <Route path="*" element={<Page title="Not found" />} />
      </Routes>
    </>
  );
}
