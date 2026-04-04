import { Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { LandingPage } from '@/pages/LandingPage';
import { CreatePage } from '@/pages/CreatePage';
import { DetailPage } from '@/pages/DetailPage';

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#f0f0f0' }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/events/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
